// Type Imports
import type { BaseOutputData } from './entityTypes'
import type { BaseQueryParams } from './queryTypes'
import type { Option } from './option'

export const enum AccountStatus {
  DISABLED = 0,
  ENABLED = 1
}

export const enum AccountChannel {
  QI_HU = 'qihu',
  BAIDU = 'baidu'
}

export type AccountStoreInputData = {
  channel: AccountChannel
  username: string
  eId?: string
  userid?: number
  secret?: string
  status?: AccountStatus
}

export type AccountOutputData = BaseOutputData &
  Omit<AccountStoreInputData, 'status' | 'channel'> & {
    channel: Option<AccountChannel>
    status: Option<AccountStatus>
  }

export type AccountEditStatusInputData = BaseOutputData & { status: AccountStatus }

export type AccountQueryInputData = BaseQueryParams & { status?: AccountStatus }
