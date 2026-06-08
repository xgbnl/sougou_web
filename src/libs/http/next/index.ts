// Next Imports
import { redirect, RedirectType } from 'next/navigation'

// Libs Imports
import { auth } from '@/libs/auth'

// Libs Imports
import { httpClient } from '../fetcher'

// Types Imports
import type {
  WithToken,
  HttpGet,
  HttpPost,
  HttpPatch,
  HttpDelete,
  HttpRequestParameter,
  HttpPostParameter,
  HttpPatchParameter,
  HttpDeleteParameter,
  HttpResult,
  WithException,
  Content
} from '@/libs/http/types'
import { HttpErrorBoundary } from '@/libs/http/types'

const withToken: WithToken = async (): Promise<string | null> => (await auth())?.user?.token ?? null

const withException: WithException = (response: Omit<Content<unknown>, 'data'>): void => {
  if (response.code === 401) {
    redirect('/' + HttpErrorBoundary.UNAUTHENTICATED, RedirectType.replace)
  }

  if (response.code === 403) {
    redirect('/' + HttpErrorBoundary.UNAUTHORIZED, RedirectType.replace)
  }

  if (response.code === 404) {
    redirect('/' + HttpErrorBoundary.NOTFOUND, RedirectType.replace)
  }
}

const get: HttpGet = <T>(url: string, params: HttpRequestParameter = {}): Promise<HttpResult<T>> => {
  return httpClient<T>({
    url,
    method: 'GET',
    withToken,
    withException,
    ...params
  })
}

const post: HttpPost = <T>(url: string, params: HttpPostParameter = {}): Promise<HttpResult<T>> => {
  return httpClient<T>({
    url,
    method: 'POST',
    withToken,
    withException,
    ...params
  })
}

const patch: HttpPatch = <T>(url: string, params: HttpPatchParameter = {}): Promise<HttpResult<T>> => {
  return httpClient<T>({
    url,
    method: 'PATCH',
    withToken,
    withException,
    ...params
  })
}

const destroy: HttpDelete = <T>(url: string, params: HttpDeleteParameter = {}): Promise<HttpResult<T>> => {
  return httpClient<T>({
    url,
    method: 'DELETE',
    withToken,
    withException,
    ...params
  })
}

export { get, post, patch, destroy }
