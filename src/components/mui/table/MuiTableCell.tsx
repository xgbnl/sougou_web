// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

// Util Imports
import { isPlainObject } from '@/utils/isPlainObject'

// Type Imports
import type { TableHeadCell, Row } from './types'

type Props<T extends Row> = {
  columns: TableHeadCell<T>[]
  row: T
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

function render<T extends Row>(headCell: TableHeadCell<T>, row: T): ReactNode {
  const emptyText = <Typography>-</Typography>

  if (typeof headCell.format === 'function') {
    const value = headCell.format(row)

    return isEmptyValue(value) ? emptyText : value
  }

  if (typeof headCell.action === 'function') {
    const value = headCell.action(row)

    return isEmptyValue(value) ? emptyText : value
  }

  const value = row[headCell.id]

  if (isPlainObject(value)) {
    throw new Error(
      `${String(headCell.id)} is a plain object, but it is not supported in MuiTableCell.Please use format function to render it.`
    )
  }

  return isEmptyValue(value) ? emptyText : (value as ReactNode)
}

export default function MuiTableCell<T extends Row>(props: Props<T>): ReactNode {
  const { columns, row } = props

  return columns.map((headCell: TableHeadCell<T>) => {
    const id = headCell.id as string

    return (
      <TableCell id={`enhanced-table-checkbox-${id}`} key={id} align={headCell.numeric ? 'right' : 'left'}>
        {render(headCell, row)}
      </TableCell>
    )
  })
}
