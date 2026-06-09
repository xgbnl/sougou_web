// React Imports
import type { ReactElement } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Lib Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Views Imports
import MuiAlert from '@/views/MuiAlert'

// Type Imports
import type { MarketingLeadStatsOutputData } from '@/types/marketingLeadTypes'

const getMarketingLeadStats = async (): Promise<ResponseInterface<MarketingLeadStatsOutputData>> => {
  return get('dashboard/marketing-leads/stats')
}

const Dashboard = async (): Promise<ReactElement> => {
  const res = await getMarketingLeadStats()
  const stats = res.whenFailureRedirect().failed() ? { totalLeads: 0, todayLeads: 0 } : res.getContent()

  return (
    <Grid container spacing={6}>
      {res.failed() ? (
        <Grid size={{ xs: 12 }}>
          <MuiAlert message={res.getMessage()} />
        </Grid>
      ) : null}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              所有线索
            </Typography>
            <Typography variant='h3' sx={{ mt: 2 }}>
              {stats.totalLeads}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              今日线索
            </Typography>
            <Typography variant='h3' sx={{ mt: 2 }}>
              {stats.todayLeads}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Dashboard
