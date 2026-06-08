// Type Imports
import type { ResponseInterface, Content, WithException } from './types'

export default class JsonResponse<T> implements ResponseInterface<T> {
  constructor(
    protected readonly response: Content<T>,
    protected readonly error: Error | null = null,
    protected readonly exceptionHandler: WithException | null = null
  ) {}

  whenFailureRedirect(): ResponseInterface<T> {
    if (this.exceptionHandler) {
      this.exceptionHandler(this.response)
    }

    return this
  }

  getContent(): T {
    return this.response.data
  }

  body(): Content<T> {
    return this.response
  }

  getStatusCode(): number {
    return this.response.code
  }

  getMessage(): string {
    if (this.error instanceof Error) {
      return '请接接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题'
    }

    return this.response.msg
  }

  failed(): boolean {
    if (this.error instanceof Error && this.error.name === 'AbortError') {
      return false
    }

    return this.errorStatusCode().includes(this.response.code)
  }

  protected errorStatusCode(): number[] {
    return [
      400, // BadRequest
      401, // Unauthorized
      403, // Forbidden
      404, // NotFound
      405, // MethodNotAllowed
      419, // PageExpired
      422, // Validation
      429, // TooManyRequests
      500, // ServerError
      502 // BadGateway
    ]
  }
}
