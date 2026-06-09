// Type Imports
import type { BaseOutputData } from './entityTypes'

export type UserOutputData = {
  description: string
  username: string
  createdAt: string
} & BaseOutputData

export type UserStoreOutputData = Pick<UserOutputData, 'description' | 'username'> & { password: string }

export type UserAssignableAccount = {
  id: number
  username: string
  eId: string
  userid: number
}

export type UserAccountsOutputData = {
  accounts: UserAssignableAccount[]
  selectedIds: number[]
}

export type UserAccountsInputData = {
  id: number | string
  accountIds: number[]
}

export type UserResetPasswordInputData = {
  id: number | string
  password: string
  passwordConfirmation: string
}
