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
import CreateAccountDialog from './CreateAccountDialog'
import EditStatus from './EditStatus'
import TableFilter from './TableFilter'

// Action Imports
import { fetchAccountList } from '@/actions/accountActions'

// Type Imports
import type { OutPutPort, QueryHandler, BaseQueryParams } from '@/types/queryTypes'
import type { AccountOutputData, AccountQueryInputData } from '@/types/accountTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const headCells: TableHeadCell<AccountOutputData & Row>[] = [
  { disablePadding: false, id: 'id', label: 'ID', numeric: false },
  { disablePadding: false, id: 'username', label: '用户名', numeric: false },
  { disablePadding: false, id: 'eId', label: '点睛id', numeric: false },
  { disablePadding: false, id: 'userid', label: 'UserId', numeric: false },
  { disablePadding: false, id: 'secret', label: 'secret', numeric: false },
  {
    disablePadding: false,
    id: 'status',
    label: '状态',
    numeric: false,
    format: (row): ReactElement => <EditStatus {...row} />
  }
]

const AccountsPage = (props: OutPutPort<AccountOutputData>): ReactElement => {
  // States
  const [rows, setRows] = useState<AccountOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)

  // Hooks
  const queryHandler: QueryHandler<AccountQueryInputData & BaseQueryParams> = async (params): Promise<void> => {
    const res = await fetchAccountList(params)

    if (!res.whenFailureRedirect().failed()) {
      setRows(res.getContent().list)
      setTotal(res.getContent().total)
    }
  }

  const handlePageChange = (page: number, perPage: number): void => {
    queryHandler({ page, perPage })
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
          slot: (): ReactElement => (
            <Grid container spacing={4}>
              <Grid spacing={3} alignContent='flex-end'>
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                    variant: 'contained',
                    children: '创建账户',
                    startIcon: <i className='tabler-plus' />
                  }}
                  dialog={CreateAccountDialog}
                  dialogProps={{
                    closeAfterTransition: true,
                    refresh: (): void => handlePageChange(1, 10)
                  }}
                />
              </Grid>
            </Grid>
          ),
          filter: (): ReactElement => <TableFilter queryHandler={queryHandler} />
        }}
      />
    </Card>
  )
}

export default AccountsPage
