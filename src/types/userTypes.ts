// Type Imports
import type { BaseOutputData } from './entityTypes'

export type UserOutputData = {
  displayName: string
  username: string
  createdAt: string
} & BaseOutputData

export type UserStoreOutputData = Pick<UserOutputData, 'displayName' | 'username'> & { password: string }
