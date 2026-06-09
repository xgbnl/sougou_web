// Lib Imports
import { get, post } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type {
  MarketingLeadQueryInputData,
  MarketingLeadOutputData,
  MarketingLeadStoreInputData,
  MarketingLeadStatsOutputData
} from '@/types/marketingLeadTypes'

/**
 * 获取线索列表
 * @param params
 * @returns
 */
export const fetchMarketingLeadList = async (
  params: MarketingLeadQueryInputData
): Promise<ResponseInterface<OutPutPort<MarketingLeadOutputData>>> => {
  return get('marketing-leads', { params })
}

/**
 * 添加线索数据
 * @param input
 * @returns
 */
export const createMarketingLead = async (
  input: MarketingLeadStoreInputData
): Promise<ResponseInterface<null>> => {
  return post('marketing-leads', { body: input })
}

/**
 * 获取线索统计
 * @returns
 */
export const fetchMarketingLeadStats = async (): Promise<ResponseInterface<MarketingLeadStatsOutputData>> => {
  return get('dashboard/marketing-leads/stats')
}
