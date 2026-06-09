'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// NextAuth Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// Component Imports
import DateRange from '@components/mui/date-range'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CreateMarketingLeadDialog from './CreateMarketingLeadDialog'

// Type Imports
import type { QueryHandler } from '@/types/queryTypes'
import type { MarketingLeadQueryInputData } from '@/types/marketingLeadTypes'

type Props = {
  query: MarketingLeadQueryInputData
  queryHandler: QueryHandler<MarketingLeadQueryInputData>
}

const TableFilter = ({ query, queryHandler }: Props): ReactElement => {
  const { data: session } = useSession()
  const [dateRange, setDateRange] = useState<Pick<MarketingLeadQueryInputData, 'startDate' | 'endDate'>>({})
  const canCreate = session?.user?.role === 'admin'

  return (
    <Grid container spacing={4}>
      {canCreate ? (
        <Grid spacing={3} alignContent='flex-end'>
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{
              variant: 'contained',
              children: '添加数据',
              startIcon: <i className='tabler-plus' />
            }}
            dialog={CreateMarketingLeadDialog}
            dialogProps={{
              closeAfterTransition: true,
              refresh: (): void => {
                void queryHandler({ ...query, ...dateRange, page: 1 })
              }
            }}
          />
        </Grid>
      ) : null}
      <Grid spacing={3} alignContent='flex-end'>
        <DateRange
          onChange={(_, [startDate, endDate]): void => {
            setDateRange({ startDate, endDate })
          }}
        />
      </Grid>
      <Grid spacing={3} alignContent='flex-end'>
        <Button
          variant='contained'
          color='primary'
          onClick={(): void => {
            queryHandler({ ...query, page: 1, ...dateRange })
          }}
        >
          搜索
        </Button>
      </Grid>
    </Grid>
  )
}

export default TableFilter
