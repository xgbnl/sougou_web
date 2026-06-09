'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

import Card from '@mui/material/Card'

// Component Imports
import MuiTable from '@components/mui/table'
import TableFilter from './TableFilter'

// Action Imports
import { fetchMarketingLeadList } from '@/actions/marketingLeadActions'

// Type Imports
import type { OutPutPort, QueryHandler } from '@/types/queryTypes'
import type { MarketingLeadQueryInputData, MarketingLeadOutputData } from '@/types/marketingLeadTypes'
import type { Row, TableHeadCell } from '@components/mui/table/types'

const headCells: TableHeadCell<MarketingLeadOutputData & Row>[] = [
  { disablePadding: false, id: 'id', label: 'ID', numeric: false },
  { disablePadding: false, id: 'siteName', label: '落地页名称', numeric: false },
  { disablePadding: false, id: 'customerName', label: '客户姓名', numeric: false },
  { disablePadding: false, id: 'customerTel', label: '客户手机号', numeric: false },
  { disablePadding: false, id: 'adSearchWord', label: '搜索词', numeric: false },
  { disablePadding: false, id: 'adKeyword', label: '关键词', numeric: false },
  { disablePadding: false, id: 'createTime', label: '线索记录时间', numeric: false }
]

const MarketingLeadsPage = (props: OutPutPort<MarketingLeadOutputData>): ReactElement => {
  const [rows, setRows] = useState<MarketingLeadOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)
  const [query, setQuery] = useState<MarketingLeadQueryInputData>({ page: 1, perPage: 10 })

  const queryHandler: QueryHandler<MarketingLeadQueryInputData> = async (params): Promise<void> => {
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
          filter: (): ReactElement => <TableFilter query={query} queryHandler={queryHandler} />
        }}
      />
    </Card>
  )
}

export default MarketingLeadsPage
