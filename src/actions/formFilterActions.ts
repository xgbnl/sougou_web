// Lib Imports
import { destroy, get, post } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'
import type { OutPutPort } from '@/types/queryTypes'

// Type Imports
import type {
  FormFilterOutputData,
  FormFilterQueryInputData,
  FormFilterStoreInputData
} from '@/types/formFilterTypes'

/**
 * 获取表单过滤列表
 * @param params
 * @returns
 */
export const fetchFormFilterList = async (
  params: FormFilterQueryInputData
): Promise<ResponseInterface<OutPutPort<FormFilterOutputData>>> => {
  return get('form-filters', { params })
}

/**
 * 添加表单过滤项
 * @param inputData
 * @returns
 */
export const createFormFilter = async (inputData: FormFilterStoreInputData): Promise<ResponseInterface<null>> => {
  return post('form-filters', { body: inputData })
}

/**
 * 删除表单过滤项
 * @param id
 * @returns
 */
export const deleteFormFilter = async (id: number | string): Promise<ResponseInterface<null>> => {
  return destroy('form-filters/:id', {
    pathVariables: { id }
  })
}
