'use client'

// React Imports
import type { MouseEvent, ReactNode } from 'react'
import { useMemo } from 'react'

// MUI Imports
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

// Components Imports
import MuiTableCell from './MuiTableCell'

// Type Imports
import type { TableRowProps, Row } from './types'

type Props<T extends Row> = {
  selected: T[]
  onClick: (row: T) => void
} & TableRowProps<T>

export default function MuiTableSortRow<T extends Row>({ row, selected, columns, onClick }: Props<T>): ReactNode {
  const isItemSelected = useMemo((): boolean => selected.includes(row), [selected, row])

  const handelOnClick = (event: MouseEvent<unknown>): void => {
    event?.stopPropagation()
    onClick(row)
  }

  return (
    <TableRow
      hover
      onClick={handelOnClick}
      role='checkbox'
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding='checkbox'>
        <Checkbox color='primary' checked={isItemSelected} />
      </TableCell>
      <MuiTableCell<T> row={row} columns={columns} />
    </TableRow>
  )
}
