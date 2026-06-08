// React Imports
import type { ReactNode, ReactElement } from 'react'

export type Order = 'asc' | 'desc'

export type Row = {
  id: number | string
  actions?: unknown
} & Record<string, unknown>

export type RowKey<T extends Row> = keyof T | ((row: T) => string | number)

export type TableSlotProp<T> = {
  slotProps?: {
    slot?: () => ReactNode
    effectActions?: (rows: T[]) => ReactElement
    filter?: () => ReactElement
  }
}

export type TableHeadCell<T extends Row> = {
  disablePadding: boolean
  id: keyof T
  label: string
  numeric: boolean
  format?: (row: T) => ReactNode
  action?: (row: T) => ReactElement
}

export type TableRowProps<T extends Row> = {
  row: T
  columns: TableHeadCell<T>[]
}

export type MuiTableProps<T extends Row> = {
  rows: T[]
  sortBy: keyof T
  headCells: TableHeadCell<T>[]
  multiple?: boolean
  onDelete?: (rows: T[]) => void
  onPageChange: (page: number, pageSize: number) => void
  total: number
  withKey?: RowKey<T>
  rowsPerPageOptions?: readonly number[]
} & TableSlotProp<T>
