// Type Imports
import type { BaseOutputData } from './entityTypes'
import type { BaseQueryParams } from './queryTypes'
import type { Option } from './option'

export const enum FormFilterType {
  NAME = 'name',
  PHONE = 'phone'
}

export type FormFilterStoreInputData = {
  type: FormFilterType
  value: string
}

export type FormFilterOutputData = BaseOutputData &
  Omit<FormFilterStoreInputData, 'type'> & {
    type: Option<FormFilterType>
    createdAt?: string
  }

export type FormFilterQueryInputData = BaseQueryParams & {
  type?: FormFilterType
}
