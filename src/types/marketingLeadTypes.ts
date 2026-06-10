// Type Imports
import type { BaseQueryParams } from './queryTypes'
import type { BaseOutputData } from './entityTypes'

export type MarketingLeadQueryInputData = {
  startDate?: string
  endDate?: string
} & BaseQueryParams

export type MarketingLeadOutputData = BaseOutputData & {
  clueTime: string
  siteName: string
  username: string
  phone: string
  searchWord: string
  keyword: string
}

export type MarketingLeadImportInputData = {
  file: File
  accountIds: number[]
}

export type MarketingLeadStatsOutputData = {
  totalLeads: number
  todayLeads: number
}
