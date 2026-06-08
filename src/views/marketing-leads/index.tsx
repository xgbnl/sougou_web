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
import DateRange from '@components/mui/date-range'

// Action Imports
import { fetchMarketingLeadList } from '@/actions/marketingLeadActions'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { MarketingLeadListQueryInputData, MarketingLeadOutputData } from '@/types/marketingLeadTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const headCells: TableHeadCell<MarketingLeadOutputData & Row>[] = [
  { disablePadding: false, id: 'id', label: 'ID', numeric: false },
  { disablePadding: false, id: 'campaignName', label: '推广计划名称', numeric: false },
  { disablePadding: false, id: 'campaignId', label: '推广计划ID', numeric: false },
  { disablePadding: false, id: 'groupName', label: '推广组名称', numeric: false },
  { disablePadding: false, id: 'groupId', label: '推广组ID', numeric: false },
  { disablePadding: false, id: 'gender', label: '性别', numeric: false },
  { disablePadding: false, id: 'phone', label: '手机号', numeric: false },
  { disablePadding: false, id: 'createTime', label: '线索记录时间', numeric: false }
]

const MarketingLeadsPage = (props: OutPutPort<MarketingLeadOutputData>): ReactElement => {
  const [rows, setRows] = useState<MarketingLeadOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)
  const [query, setQuery] = useState<MarketingLeadListQueryInputData>({ page: 1, perPage: 10 })
  const [dateRange, setDateRange] = useState<Pick<MarketingLeadListQueryInputData, 'startDate' | 'endDate'>>({})

  const queryHandler = async (params: MarketingLeadListQueryInputData): Promise<void> => {
    const res = await fetchMarketingLeadList(params)

    if (!res.whenFailureRedirect().failed()) {
      setRows(res.getContent().list)
      setTotal(res.getContent().total)
      setQuery(params)
    }
  }

  const handlePageChange = (page: number, perPage: number): void => {
    queryHandler({ ...query, page, perPage })
  }

  const handleSearch = (): void => {
    queryHandler({ ...query, ...dateRange, page: 1 })
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
          slot: () => '线索列表',
          filter: (): ReactElement => (
            <Grid container spacing={4}>
              <Grid spacing={3} alignContent='flex-end'>
                <DateRange
                  onChange={(_, [startDate, endDate]): void => {
                    setDateRange({ startDate, endDate })
                  }}
                />
              </Grid>
              <Grid spacing={3} alignContent='flex-end'>
                <Button variant='contained' color='primary' onClick={handleSearch}>
                  搜索
                </Button>
              </Grid>
            </Grid>
          )
        }}
      />
    </Card>
  )
}

export default MarketingLeadsPage
