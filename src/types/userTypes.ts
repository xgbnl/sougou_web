// Type Imports
import type { BaseOutputData } from './entityTypes'

export type UserOutputData = {
  description: string
  username: string
  createdAt: string
} & BaseOutputData

export type UserStoreOutputData = Pick<UserOutputData, 'description' | 'username'> & { password: string }
