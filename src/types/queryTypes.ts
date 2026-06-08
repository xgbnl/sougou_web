export type BaseQueryParams = {
  perPage: number
  page: number
}

export type OutPutPort<T> = {
  total: number
  list: T[]
}

// Table Filter Handler.
export type QueryHandler<T = BaseQueryParams> = (params: T) => void | Promise<void>
