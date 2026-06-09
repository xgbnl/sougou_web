'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

// Component Imports
import DateRange from '@components/mui/date-range'

// Type Imports
import type { QueryHandler } from '@/types/queryTypes'
import type { MarketingLeadQueryInputData } from '@/types/marketingLeadTypes'

type Props = {
  query: MarketingLeadQueryInputData
  queryHandler: QueryHandler<MarketingLeadQueryInputData>
}

const TableFilter = ({ query, queryHandler }: Props): ReactElement => {
  const [dateRange, setDateRange] = useState<Pick<MarketingLeadQueryInputData, 'startDate' | 'endDate'>>({})

  return (
    <Grid container spacing={4}>
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
