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
import { FormFilterType, type FormFilterQueryInputData } from '@/types/formFilterTypes'

const TableFilter = ({ queryHandler }: { queryHandler: QueryHandler<FormFilterQueryInputData> }): ReactElement => {
  const [type, setType] = useState<FormFilterType | ''>('')

  return (
    <Grid container spacing={4}>
      <Grid spacing={3} alignContent='flex-end'>
        <EnumSelect
          items={[
            { label: '全部类型', value: '' },
            { label: '姓名', value: FormFilterType.NAME },
            { label: '手机号', value: FormFilterType.PHONE }
          ]}
          onChange={(value): void => setType(value as FormFilterType | '')}
          value={type}
        />
      </Grid>
      <Grid spacing={3} alignContent='flex-end'>
        <Button
          variant='contained'
          color='primary'
          onClick={(): void => {
            queryHandler({
              page: 1,
              perPage: 10,
              ...(type ? { type } : {})
            })
          }}
        >
          搜索
        </Button>
      </Grid>
    </Grid>
  )
}

export default TableFilter
