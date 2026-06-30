// Type Imports
import type { BaseQueryParams } from './queryTypes'
import type { BaseOutputData } from './entityTypes'
import type { Option } from './option'

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
  channel?: Option<'baidu' | 'qihu' | 'sougou'>
}

export type MarketingLeadImportInputData = {
  file: File
  accountIds: number[]
}

export type MarketingLeadStatsOutputData = {
  totalLeads: number
  todayLeads: number
}
