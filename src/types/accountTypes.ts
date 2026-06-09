// Type Imports
import type { BaseOutputData } from './entityTypes'
import type { BaseQueryParams } from './queryTypes'
import type { Option } from './option'

export const enum AccountStatus {
  DISABLED = 0,
  ENABLED = 1
}

export type AccountStoreInputData = {
  username: string
  eId: string
  userid: number
  secret: string
  status?: AccountStatus
}

export type AccountOutputData = BaseOutputData &
  Omit<AccountStoreInputData, 'status'> & {
    status: Option<AccountStatus>
  }

export type AccountEditStatusInputData = BaseOutputData & { status: AccountStatus }

export type AccountQueryInputData = BaseQueryParams & { status?: AccountStatus }
