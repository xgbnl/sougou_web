'use client'

// React Imports
import { useState, type ReactElement } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Grid from '@mui/material/Grid'

// Components Imports
import EnumSelect from '@components/mui/enum-select'
import EnumRadio from '@components/mui/enum-radio'

type PayStatus = 'all' | 'paid' | 'unpaid'

type Toggle = 'enabled' | 'disabled'

export default function EnumOptionExample(): ReactElement {
  // States
  const [payStatus, setPayStatus] = useState<PayStatus>('all')
  const [toggle, setToggle] = useState<Toggle>('enabled')

  return (
    <>
      {/** Table filter Card */}
      <Card sx={{ minWidth: 275 }} className='mb-6'>
        <CardActions>
          <Grid size={{ xs: 4, sm: 2 }}>
            <EnumSelect
              items={[
                { label: 'All pay status', value: 'all' },
                { label: 'Paid', value: 'paid' },
                { label: 'Unpaid', value: 'unpaid' }
              ]}
              label='Union select'
              value={payStatus}
              onChange={(v: PayStatus): void => setPayStatus(v)}
            />
          </Grid>
          <Grid size={{ xs: 2, sm: 3 }}>
            <EnumRadio
              label='Union Radios'
              onChange={(value: Toggle): void => setToggle(value)}
              value={toggle}
              options={[
                { label: 'Enabled', value: 'enabled' },
                { label: 'Disabled', value: 'disabled' }
              ]}
            />
          </Grid>
        </CardActions>
      </Card>
    </>
  )
}
