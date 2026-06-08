/**
 * Base HTTP request parameters definition
 */
export type HttpRequestParameter = {
  /**
   * Path variables used to replace :key placeholders in the URL
   */
  pathVariables?: Record<string, string | number>

  /**
   * Body data to be sent in the request
   */
  body?: Record<string, unknown> | FormData

  /**
   * Query parameters to be converted into a URL Query String
   */
  params?: Record<string, string | number>

  /**
   * Path rewrite rules
   */
  pathRewrite?: Record<string, string>

  /**
   * Resource type
   */
  resource?: 'json' | 'blob' | 'text' | 'buffer'
}

/**
 * Unified backend response data structure
 */
export type Content<T> = {
  /**
   * Business logic status code
   */
  code: number

  /**
   * Response message
   */
  msg: string

  /**
   * Business data payload
   */
  data: T
}

export interface ResponseInterface<T> {
  /**
   * Gets the HTTP status code of the response.
   * @returns The HTTP status code of the response.
   */
  getStatusCode(): number

  /**
   * Gets then HTTP content of the response.
   * @returns The HTTP content of the response.
   */
  getContent(): T

  /**
   * Gets the raw body of the response.
   * @returns The raw body of the response.
   */
  body(): Content<T>

  /**
   * Gets the HTTP message of the response.
   * @returns The HTTP message of the response.
   */
  getMessage(): string

  /**
   * Checks whether the HTTP response indicates a failure.
   * @returns True if the HTTP response indicates a failure, false otherwise.
   */
  failed(): boolean

  /**
   * Redirects to the error page when the HTTP response indicates a failure.
   * @returns The response interface.
   */
  whenFailureRedirect(): ResponseInterface<T>
}

/**
 * The final result type after an HTTP request execution.
 * Includes either the wrapped data on success or a unified response interface on failure.
 * If T is already a ResponseInterface type, return T directly; otherwise wrap it in ResponseInterface<T>.
 */
export type HttpResult<T> = T extends string
  ? string
  : T extends Blob
    ? Blob
    : T extends ArrayBuffer
      ? ArrayBuffer
      : T extends ResponseInterface<unknown>
        ? T
        : ResponseInterface<T>

/**
 * Parameter type specifically for POST requests
 */
export type HttpPostParameter = Partial<Omit<HttpRequestParameter, 'pathVariables'>>

/**
 * Parameter type specifically for PATCH requests
 */
export type HttpPatchParameter = Partial<Omit<HttpRequestParameter, 'params'>>

/**
 * Parameter type specifically for DELETE requests
 */
export type HttpDeleteParameter = Partial<Omit<HttpRequestParameter, 'body' | 'params'>>

/**
 * Method signature for GET requests
 */
export type HttpGet = <T>(url: string, params?: HttpRequestParameter) => Promise<HttpResult<T>>

/**
 * Method signature for POST requests
 */
export type HttpPost = <T>(url: string, params?: HttpPostParameter) => Promise<HttpResult<T>>

/**
 * Method signature for PATCH requests
 */
export type HttpPatch = <T>(url: string, params?: HttpPatchParameter) => Promise<HttpResult<T>>

/**
 * Method signature for DELETE requests
 */
export type HttpDelete = <T>(url: string, params?: HttpDeleteParameter) => Promise<HttpResult<T>>

/**
 * Callback definition for retrieving the Bearer Token
 */
export type WithToken = () => Promise<string | null>

/**
 * Callback definition for exception handling
 */
export type WithException = (response: Omit<Content<unknown>, 'data'>) => void

/**
 * List of HTTP status codes considered as errors
 */
export const HttpStatus = [
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

/**
 * List of HTTP error boundaries
 */
export const enum HttpErrorBoundary {
  NOTFOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
  UNAUTHENTICATED = 'unauthenticated'
}
