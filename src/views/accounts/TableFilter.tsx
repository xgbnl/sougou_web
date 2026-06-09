'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// Component Imports
import EnumSelect from '@/components/mui/enum-select'

// Type Imports
import type { QueryHandler } from '@/types/queryTypes'
import { AccountStatus, type AccountQueryInputData } from '@/types/accountTypes'

const TableFilter = ({ queryHandler }: { queryHandler: QueryHandler<AccountQueryInputData> }): ReactElement => {
  const [status, setStatus] = useState<AccountStatus>(AccountStatus.ENABLED)

  return (
    <Grid container spacing={4}>
      <Grid spacing={3} alignContent='flex-end'>
        <EnumSelect
          items={[
            { label: '启用', value: AccountStatus.ENABLED },
            { label: '禁用', value: AccountStatus.DISABLED }
          ]}
          onChange={(value): void => setStatus(Number(value))}
          value={status}
        />
      </Grid>
      <Grid spacing={3} alignContent='flex-end'>
        <Button
          variant='contained'
          color='primary'
          onClick={(): void => {
            queryHandler({ page: 1, perPage: 10, status })
          }}
        >
          搜索
        </Button>
      </Grid>
    </Grid>
  )
}

export default TableFilter
