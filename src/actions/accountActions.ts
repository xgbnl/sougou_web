// Lib Imports
import { get, post, patch } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'
import type { OutPutPort } from '@/types/queryTypes'

// Type Imports
import type {
  AccountOutputData,
  AccountStoreInputData,
  AccountEditStatusInputData,
  AccountQueryInputData
} from '@/types/accountTypes'

/**
 * 获取账户列表
 * @param params
 * @returns
 */
export const fetchAccountList = async (
  params: AccountQueryInputData
): Promise<ResponseInterface<OutPutPort<AccountOutputData>>> => {
  return get('accounts', { params })
}

/**
 * 创建账户
 * @param inputData
 * @returns
 */
export const createAccount = async (inputData: AccountStoreInputData): Promise<ResponseInterface<null>> => {
  return post('accounts', {
    body: inputData
  })
}

/**
 * 编辑状态
 * @param param0
 * @returns
 */
export const editAccountStatus = async ({
  id,
  ...body
}: AccountEditStatusInputData): Promise<ResponseInterface<null>> => {
  return patch('accounts/:id', {
    pathVariables: { id },
    body
  })
}
