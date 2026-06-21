// Lib Imports
import { get, post, patch, destroy } from '@/libs/http/react'
import type { ResponseInterface } from '@/libs/http/types'

// Type Imports
import type { OutPutPort, BaseQueryParams } from '@/types/queryTypes'
import type {
  UserOutputData,
  UserStoreOutputData,
  UserAccountsOutputData,
  UserAccountsInputData,
  UserResetPasswordInputData
} from '@/types/userTypes'

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

/**
 * 获取用户可分配线索账户
 * @param id
 * @returns
 */
export const fetchUserAccounts = async (id: number | string): Promise<ResponseInterface<UserAccountsOutputData>> => {
  return get('users/:id/accounts', { pathVariables: { id } })
}

/**
 * 保存用户线索账户分配
 * @param input
 * @returns
 */
export const syncUserAccounts = async ({
  id,
  accountIds
}: UserAccountsInputData): Promise<ResponseInterface<null>> => {
  return patch('users/:id/accounts', {
    pathVariables: { id },
    body: { accountIds }
  })
}

/**
 * 重置用户密码
 * @param input
 * @returns
 */
export const resetUserPassword = async ({
  id,
  password,
  passwordConfirmation
}: UserResetPasswordInputData): Promise<ResponseInterface<null>> => {
  return patch('users/:id', {
    pathVariables: { id },
    body: { password, passwordConfirmation }
  })
}

/**
 * 清空用户名下线索
 * @param id
 * @returns
 */
export const clearUserMarketingLeads = async (id: number | string): Promise<ResponseInterface<null>> => {
  return patch('users/:id/marketing-leads/clear', {
    pathVariables: { id }
  })
}

/**
 * 删除用户
 * @param id
 * @returns
 */
export const deleteUser = async (id: number | string): Promise<ResponseInterface<null>> => {
  return destroy('users/:id', {
    pathVariables: { id }
  })
}
