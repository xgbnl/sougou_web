// Utils Imports
import { isPlainObject } from '@utils/isPlainObject'
import { ensurePrefix, stringify } from '@/utils/string'

// Types Imports
import JsonResponse from './JsonResponse'
import type {
  WithToken,
  WithException,
  HttpRequestParameter,
  HttpResult,
  ResponseInterface,
  Content
} from '@/libs/http/types'

type WithOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  withToken: WithToken
  withException: WithException
} & HttpRequestParameter &
  Pick<Request, 'url'>

const pendingRequests: Record<string, null | AbortController> = {}

const AbortWhiteList: string[] = []

export async function httpClient<T>(options: WithOptions): Promise<HttpResult<T>> {
  let controller: AbortController | null = null

  if (!AbortWhiteList.includes(options.url)) {
    const previousController: AbortController | null = pendingRequests[options.url]

    if (previousController) {
      previousController.abort()
    }

    controller = new AbortController()

    pendingRequests[options.url] = controller
  }

  const baseConfig: RequestInit & Pick<Request, 'url'> = {
    signal: controller ? controller.signal : null,
    method: options.method,
    headers: await withHeader(options),
    mode: 'cors',
    cache: 'no-cache',
    url: buildUrl(options)
  }

  if (options.method !== 'GET') {
    if (isPlainObject(options.body)) {
      baseConfig.body = JSON.stringify(options.body)
    } else if (options.body instanceof FormData) {
      baseConfig.body = options.body
    }
  }

  return fetch(baseConfig.url, baseConfig)
    .then(async (response: Response): Promise<HttpResult<T>> => {
      if (!response.ok) {
        return Promise.reject<HttpResult<T>>({
          code: response.status,
          msg: response.statusText
        })
      }

      const { resource = 'json' } = options

      switch (resource) {
        case 'text':
          return (await response.text()) as unknown as Promise<HttpResult<T>>
        case 'blob':
          return (await response.blob()) as unknown as Promise<HttpResult<T>>
        case 'buffer':
          return (await response.arrayBuffer()) as unknown as Promise<HttpResult<T>>
      }

      const content: Content<T> = await response.json()

      const resp: ResponseInterface<T> = new JsonResponse<T>(content)

      if (resp.failed()) {
        return Promise.reject(content)
      }

      return resp as unknown as Promise<HttpResult<T>>
    })
    .catch((error: Error | Content<T>): Promise<ResponseInterface<unknown>> => {
      if (error instanceof Error) {
        const statusCode = error.name === 'AbortError' ? 501 : 500

        return Promise.resolve(
          new JsonResponse<unknown>({ code: statusCode, msg: error.message, data: null }, error, options.withException)
        )
      }

      return Promise.resolve(new JsonResponse<unknown>(error, null, options.withException))
    })
    .finally((): boolean => delete pendingRequests[options.url]) as Promise<HttpResult<T>>
}

function buildUrl(option: Pick<WithOptions, 'params' | 'url' | 'pathVariables' | 'pathRewrite'>): string {
  const { params, pathVariables = {}, pathRewrite = {} } = option

  let baseUrl: string = option.url

  if (isPlainObject(params)) {
    const queryString: string = baseUrl.endsWith('?') ? '&' : '?' + stringify(params as Record<string, string | number>)

    baseUrl += queryString
  }

  if (isPlainObject(pathVariables)) {
    const pattern = new RegExp(`:(${Object.keys(pathVariables).join('|')})\\b`, 'g')

    baseUrl = baseUrl.replace(pattern, (_, key) => String(pathVariables[key]))
  }

  let url: string = process.env.NEXT_PUBLIC_API_URL + ensurePrefix(baseUrl, '/')

  if (isPlainObject(pathRewrite)) {
    for (const [patternSource, replacement] of Object.entries(pathRewrite)) {
      url = url.replace(new RegExp(patternSource, 'g'), replacement)
    }
  }

  return url
}

async function withHeader(option: WithOptions): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: 'application/json'
  }

  if (!(option.body instanceof FormData)) {
    headers['Content-Type'] =
      isPlainObject(option.body) && option.method === 'GET'
        ? 'application/x-www-form-urlencoded'
        : 'application/json;charset=UTF-8'
  }

  const token: string | null = await option.withToken()

  if (null !== token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  return headers
}
