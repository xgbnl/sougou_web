'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

// Component Imports
import MuiTable from '@components/mui/table'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CreateUserDialog from './CreateUserDialog'
import AssignAccountsDialog from './AssignAccountsDialog'
import ResetPasswordDialog from './ResetPasswordDialog'
import DeleteUserDialog from './DeleteUserDialog'
import ClearMarketingLeadsDialog from './ClearMarketingLeadsDialog'

// Action Imports
import { fetchUserList } from '@/actions/userActions'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { UserOutputData } from '@/types/userTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const UsersPage = (props: OutPutPort<UserOutputData>): ReactElement => {
  const [rows, setRows] = useState<UserOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)
  const [query, setQuery] = useState<{ page: number; perPage: number }>({ page: 1, perPage: 10 })

  const queryHandler = async (page: number, perPage: number): Promise<void> => {
    const res = await fetchUserList({ page, perPage })

    if (!res.whenFailureRedirect().failed()) {
      setRows(res.getContent().list)
      setTotal(res.getContent().total)
      setQuery({ page, perPage })
    }
  }

  const handlePageChange = (page: number, perPage: number): void => {
    queryHandler(page, perPage)
  }

  const headCells: TableHeadCell<UserOutputData & Row>[] = [
    { disablePadding: false, id: 'id', label: 'ID', numeric: false },
    { disablePadding: false, id: 'username', label: '用户名', numeric: false },
    { disablePadding: false, id: 'description', label: '账号描述', numeric: false },
    { disablePadding: false, id: 'createdAt', label: '创建时间', numeric: false },
    {
      disablePadding: false,
      id: 'actions',
      label: '操作',
      numeric: false,
      action: (row): ReactElement => (
        <Stack direction='row' spacing={2}>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              size: 'small',
              children: '分配线索账户',
              startIcon: <i className='tabler-link' />
            }}
            dialog={AssignAccountsDialog}
            dialogProps={{
              closeAfterTransition: true,
              userId: row.id
            }}
          />
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              size: 'small',
              children: '重置密码',
              startIcon: <i className='tabler-key' />
            }}
            dialog={ResetPasswordDialog}
            dialogProps={{
              closeAfterTransition: true,
              userId: row.id
            }}
          />
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              size: 'small',
              color: 'warning',
              children: '清空线索',
              startIcon: <i className='tabler-eraser' />
            }}
            dialog={ClearMarketingLeadsDialog}
            dialogProps={{
              closeAfterTransition: true,
              userId: row.id,
              username: row.username,
              refresh: (): void => {
                void queryHandler(query.page, query.perPage)
              }
            }}
          />
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              size: 'small',
              color: 'error',
              children: '删除',
              startIcon: <i className='tabler-trash' />
            }}
            dialog={DeleteUserDialog}
            dialogProps={{
              closeAfterTransition: true,
              userId: row.id,
              username: row.username,
              refresh: (): void => {
                void queryHandler(query.page, query.perPage)
              }
            }}
          />
        </Stack>
      )
    }
  ]

  return (
    <Card>
      <MuiTable
        total={total}
        onPageChange={handlePageChange}
        rows={rows}
        sortBy='id'
        headCells={headCells}
        slotProps={{
          slot: () => '用户列表',
          filter: (): ReactElement => {
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
