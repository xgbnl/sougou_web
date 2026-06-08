// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import TableCell from '@mui/material/TableCell'

// Util Imports
import { isPlainObject } from '@/utils/isPlainObject'

// Type Imports
import type { TableHeadCell, Row } from './types'

type Props<T extends Row> = {
  columns: TableHeadCell<T>[]
  row: T
}

function render<T extends Row>(headCell: TableHeadCell<T>, row: T): ReactNode {
  if (typeof headCell.format === 'function') {
    return headCell.format(row)
  }

  if (typeof headCell.action === 'function') {
    return headCell.action(row)
  }

  const value = row[headCell.id]

  if (isPlainObject(value)) {
    throw new Error(
      `${String(headCell.id)} is a plain object, but it is not supported in MuiTableCell.Please use format function to render it.`
    )
  }

  return value as ReactNode
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
