// Type Imports
import type { BaseQueryParams } from './queryTypes'
import type { BaseOutputData } from './entityTypes'

export type MarketingLeadListQueryInputData = {
  startDate?: string
  endDate?: string
} & BaseQueryParams

export type MarketingLeadOutputData = BaseOutputData & {
  campaignId: number
  campaignName: string
  groupName: string
  groupId: string
  gender: string
  phone: string
  createTime: string
}
