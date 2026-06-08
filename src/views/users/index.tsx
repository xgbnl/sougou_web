'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// Component Imports
import MuiTable from '@components/mui/table'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CreateUserDialog from './CreateUserDialog'

// Action Imports
import { fetchUserList } from '@/actions/userActions'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { UserOutputData } from '@/types/userTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const headCells: TableHeadCell<UserOutputData & Row>[] = [
  { disablePadding: false, id: 'id', label: 'ID', numeric: false },
  { disablePadding: false, id: 'username', label: '用户名', numeric: false },
  { disablePadding: false, id: 'displayName', label: '显示名称', numeric: false },
  { disablePadding: false, id: 'createdAt', label: '创建时间', numeric: false }
]

const UsersPage = (props: OutPutPort<UserOutputData>): ReactElement => {
  const [rows, setRows] = useState<UserOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)

  const queryHandler = async (page: number, perPage: number): Promise<void> => {
    const res = await fetchUserList({ page, perPage })

    if (!res.whenFailureRedirect().failed()) {
      setRows(res.getContent().list)
      setTotal(res.getContent().total)
    }
  }

  const handlePageChange = (page: number, perPage: number): void => {
    queryHandler(page, perPage)
  }

  return (
    <Card>
      <MuiTable
        total={total}
        onPageChange={handlePageChange}
        rows={rows}
        sortBy='id'
        headCells={headCells}
        slotProps={{
          slot: (): ReactElement => {
            return (
              <Grid container spacing={4}>
                <Grid spacing={3} alignContent='flex-end'>
                  <OpenDialogOnElementClick
                    element={Button}
                    elementProps={{
                      variant: 'contained',
                      children: '新建用户',
                      startIcon: <i className='tabler-plus' />
                    }}
                    dialog={CreateUserDialog}
                    dialogProps={{
                      closeAfterTransition: true,
                      refresh: (): void => handlePageChange(1, 10)
                    }}
                  />
                </Grid>
              </Grid>
            )
          }
        }}
      />
    </Card>
  )
}

export default UsersPage
