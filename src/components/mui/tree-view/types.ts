// Types Imports
import type { TextFieldProps } from '@mui/material'
import type { SimpleTreeViewProps } from '@mui/x-tree-view/SimpleTreeView'

export type FieldNames = {
  label?: string
  value?: string
  children?: string
}

export type InternalFieldNames = {
  label: string
  value: string
  children: string
  key: string
}

export type TreeOptionBase = Record<string, unknown> & {
  label?: string
  value?: string | number
  children?: TreeOptionBase[]
  isLeaf?: boolean
}

export type Option = TreeOptionBase

export type NormalizedTreeNode<T extends Record<string, unknown>> = {
  id: string
  label: unknown
  children?: NormalizedTreeNode<T>[]
  isLeaf: boolean
  original: T
}

export type TreeBuildResult<T extends Record<string, unknown>> = {
  roots: NormalizedTreeNode<T>[]
  byId: Map<string, NormalizedTreeNode<T>>
  parentById: Map<string, string | undefined>
}

type MuiTreeViewBaseProps<T extends Record<string, unknown>> = {
  options: T[]
  fieldNames?: FieldNames
} & Pick<
  TextFieldProps,
  'error' | 'helperText' | 'label' | 'fullWidth' | 'placeholder' | 'required' | 'onBlur' | 'ref'
> &
  Pick<SimpleTreeViewProps<true>, 'id'>

export type MuiTreeViewProps<
  T extends Record<string, unknown> = TreeOptionBase,
  M extends boolean = false
> = MuiTreeViewBaseProps<T> & {
  multiple?: M
  value?: M extends true ? Array<string | number> : string | number
  onChange: (selectedLeaves: M extends true ? T[] : T | null, pathNodes: T[]) => void
}
