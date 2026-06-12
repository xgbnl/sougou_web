// Lib Imports
import { getSession } from 'next-auth/react'
import { get, post, destroy } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type {
  MarketingLeadQueryInputData,
  MarketingLeadOutputData,
  MarketingLeadImportInputData,
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
 * 获取线索统计
 * @returns
 */
export const fetchMarketingLeadStats = async (): Promise<ResponseInterface<MarketingLeadStatsOutputData>> => {
  return get('dashboard/marketing-leads/stats')
}

/**
 * 导入线索数据
 * @param input
 * @returns
 */
export const importMarketingLeads = async ({
  file,
  accountIds
}: MarketingLeadImportInputData): Promise<ResponseInterface<null>> => {
  const formData = new FormData()

  formData.append('file', file)
  accountIds.forEach(id => formData.append('accountIds[]', String(id)))

  return post('marketing-leads/import', { body: formData })
}

/**
 * 删除线索
 * @param id
 * @returns
 */
export const deleteMarketingLead = async (id: number | string): Promise<ResponseInterface<null>> => {
  return destroy('marketing-leads/:id', {
    pathVariables: { id }
  })
}

/**
 * 导出线索数据
 * @param onProgress
 * @returns
 */
export const exportMarketingLeads = async (onProgress?: (progress: number) => void): Promise<void> => {
  const token = (await getSession())?.user?.token
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketing-leads/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  if (!response.ok || response.body === null) {
    throw new Error(response.statusText || '导出失败')
  }

  const contentLength = Number(response.headers.get('Content-Length') ?? 0)
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let receivedLength = 0

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    chunks.push(value)
    receivedLength += value.length

    if (contentLength > 0) {
      onProgress?.(Math.round((receivedLength * 100) / contentLength))
    }
  }

  const chunksAll = new Uint8Array(receivedLength)
  let position = 0

  for (const chunk of chunks) {
    chunksAll.set(chunk, position)
    position += chunk.length
  }

  const blob = new Blob([chunksAll], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const link = document.createElement('a')
  const url = window.URL.createObjectURL(blob)

  document.body.appendChild(link)
  link.href = url
  link.download = `线索数据-${Date.now()}.xlsx`
  link.target = '_blank'
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
  onProgress?.(100)
}
