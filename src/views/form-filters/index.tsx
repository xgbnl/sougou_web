'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import MuiTable from '@components/mui/table'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CreateFormFilterDialog from './CreateFormFilterDialog'
import DeleteFormFilterDialog from './DeleteFormFilterDialog'
import TableFilter from './TableFilter'

// Action Imports
import { fetchFormFilterList } from '@/actions/formFilterActions'

// Type Imports
import type { OutPutPort, QueryHandler, BaseQueryParams } from '@/types/queryTypes'
import type { FormFilterOutputData, FormFilterQueryInputData } from '@/types/formFilterTypes'
import { FormFilterType } from '@/types/formFilterTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const FormFiltersPage = (props: OutPutPort<FormFilterOutputData>): ReactElement => {
  const [rows, setRows] = useState<FormFilterOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)
  const [query, setQuery] = useState<FormFilterQueryInputData>({ page: 1, perPage: 10 })

  const queryHandler: QueryHandler<FormFilterQueryInputData & BaseQueryParams> = async (params): Promise<void> => {
    const res = await fetchFormFilterList(params)

    if (!res.whenFailureRedirect().failed()) {
      setRows(res.getContent().list)
      setTotal(res.getContent().total)
      setQuery(params)
    }
  }

  const handlePageChange = (page: number, perPage: number): void => {
    queryHandler({ ...query, page, perPage })
  }

  const headCells: TableHeadCell<FormFilterOutputData & Row>[] = [
    { disablePadding: false, id: 'id', label: 'ID', numeric: false },
    {
      disablePadding: false,
      id: 'type',
      label: '过滤类型',
      numeric: false,
      format: row => (
        <Chip
          label={row.type.label}
          variant='tonal'
          size='small'
          color={row.type.value === FormFilterType.PHONE ? 'primary' : 'success'}
        />
      )
    },
    { disablePadding: false, id: 'value', label: '过滤内容', numeric: false },
    { disablePadding: false, id: 'createdAt', label: '添加时间', numeric: false },
    {
      disablePadding: false,
      id: 'actions',
      label: '操作',
      numeric: false,
      action: (row): ReactElement => (
        <Stack direction='row' spacing={2}>
          <OpenDialogOnElementClick
            element={IconButton}
            elementProps={{
              size: 'small',
              color: 'error',
              children: (
                <Tooltip title='删除'>
                  <i className='tabler-trash' />
                </Tooltip>
              )
            }}
            dialog={DeleteFormFilterDialog}
            dialogProps={{
              closeAfterTransition: true,
              filterId: row.id,
              value: row.value,
              refresh: (): void => {
                void queryHandler(query)
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
          slot: (): ReactElement => (
            <Grid container spacing={4}>
              <Grid spacing={3} alignContent='flex-end'>
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                    variant: 'contained',
                    children: '添加过滤项',
                    startIcon: <i className='tabler-plus' />
                  }}
                  dialog={CreateFormFilterDialog}
                  dialogProps={{
                    closeAfterTransition: true,
                    refresh: (): void => {
                      void queryHandler({ ...query, page: 1 })
                    }
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

export default FormFiltersPage
