// NEXT Imports
import { redirect, RedirectType } from 'next/navigation'

// NextAuth Imports
import { getSession } from 'next-auth/react'

// ThirdParty Imports
import { toast } from 'react-toastify'

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

const withToken: WithToken = async (): Promise<string | null> => (await getSession())?.user?.token ?? null

const withException: WithException = (response: Omit<Content<unknown>, 'data'>): void => {
  const { code, msg } = response

  // Except abort error
  if (code !== 501) {
    if (code === 401) {
      toast.info<string>(msg, {
        delay: 1000,
        onClose: () => redirect(HttpErrorBoundary.UNAUTHENTICATED, RedirectType.replace)
      })
    } else if (code === 422) {
      toast.warning<string>(msg)
    } else {
      toast.error<string>(msg)
    }
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
