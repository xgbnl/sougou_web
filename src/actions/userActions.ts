// Lib Imports
import { get, post } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'

// Type Imports
import type { OutPutPort, BaseQueryParams } from '@/types/queryTypes'
import type { UserOutputData, UserStoreOutputData } from '@/types/userTypes'

/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const fetchUserList = async (
  params: BaseQueryParams
): Promise<ResponseInterface<OutPutPort<UserOutputData>>> => {
  return get('users', { params })
}

/**
 * 添加用户
 * @param input
 * @returns
 */
export const createUser = async (input: UserStoreOutputData): Promise<ResponseInterface<null>> => {
  return post('users', { body: input })
}
