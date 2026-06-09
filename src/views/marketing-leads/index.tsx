'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// NextAuth Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import MuiTable from '@components/mui/table'
import TableFilter from './TableFilter'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import ImportMarketingLeadsDialog from './ImportMarketingLeadsDialog'

// Action Imports
import { exportMarketingLeads, fetchMarketingLeadList } from '@/actions/marketingLeadActions'

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
  { disablePadding: false, id: 'createTime', label: '线索提交时间', numeric: false }
]

const MarketingLeadsPage = (props: OutPutPort<MarketingLeadOutputData>): ReactElement => {
  const { data: session } = useSession()
  const [rows, setRows] = useState<MarketingLeadOutputData[]>(props.list)
  const [total, setTotal] = useState<number>(props.total)
  const [query, setQuery] = useState<MarketingLeadQueryInputData>({ page: 1, perPage: 100 })
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [downloading, setDownloading] = useState<boolean>(false)
  const canImport = session?.user?.role === 'admin'

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

  const handleExport = async (): Promise<void> => {
    setDownloading(true)
    setDownloadProgress(0)

    try {
      await exportMarketingLeads(setDownloadProgress)
    } catch (error) {
      toast.error<string>(error instanceof Error ? error.message : '导出失败')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <MuiTable
        total={total}
        onPageChange={handlePageChange}
        rows={rows}
        sortBy='id'
        headCells={headCells}
        rowsPerPageOptions={[100, 200]}
        slotProps={{
          slot: (): ReactElement => (
            <Grid container spacing={3}>
              {canImport ? (
                <Grid spacing={3} alignContent='flex-end'>
                  <OpenDialogOnElementClick
                    element={Button}
                    elementProps={{
                      variant: 'contained',
                      children: '导入数据',
                      startIcon: <i className='tabler-upload' />
                    }}
                    dialog={ImportMarketingLeadsDialog}
                    dialogProps={{
                      closeAfterTransition: true,
                      refresh: (): void => {
                        void queryHandler({ ...query, page: 1 })
                      }
                    }}
                  />
                </Grid>
              ) : null}
              <Grid spacing={3} alignContent='flex-end'>
                <Button
                  variant='tonal'
                  color='primary'
                  disabled={downloading}
                  startIcon={<i className='tabler-download' />}
                  onClick={(): void => {
                    void handleExport()
                  }}
                >
                  {downloading ? `导出数据 ${downloadProgress}%` : '导出数据'}
                </Button>
              </Grid>
            </Grid>
          ),
          filter: (): ReactElement => <TableFilter query={query} queryHandler={queryHandler} />
        }}
      />
    </Card>
  )
}

export default MarketingLeadsPage
