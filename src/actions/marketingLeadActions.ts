// Lib Imports
import { get } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { MarketingLeadListQueryInputData, MarketingLeadOutputData } from '@/types/marketingLeadTypes'

/**
 * 获取线索列表
 * @param params
 * @returns
 */
export const fetchMarketingLeadList = async (
  params: MarketingLeadListQueryInputData
): Promise<ResponseInterface<OutPutPort<MarketingLeadOutputData>>> => {
  return get('marketing-leads', { params })
}
