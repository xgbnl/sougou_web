// Type Imports
import type { BaseQueryParams } from './queryTypes'
import type { BaseOutputData } from './entityTypes'

export type MarketingLeadQueryInputData = {
  startDate?: string
  endDate?: string
} & BaseQueryParams

export type MarketingLeadOutputData = BaseOutputData & {
  createTime: string
  siteName: string
  customerName: string
  customerTel: string
  adSearchWord: string
  adKeyword: string
}

export type MarketingLeadImportInputData = {
  file: File
  accountIds: number[]
}

export type MarketingLeadStatsOutputData = {
  totalLeads: number
  todayLeads: number
}
