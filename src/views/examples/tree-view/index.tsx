'use client'

// React Imports
import type { ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Components Imports
import MuiTreeView from '@/components/apps/tree-view'

// Types Imports
import type { Option } from '@/components/apps/tree-view/types'

const options: Option[] = [
  {
    name: '北京',
    id: 10,
    children: [{ name: '北京市', id: 1011 }]
  },
  {
    name: '重庆',
    id: 23,
    children: [{ name: '重庆市', id: 2310 }]
  }
]

const TreeViewExample = (): ReactElement => {
  return (
    <Grid container rowSpacing={4}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h2'>TreeView(Cascader)</Typography>
        <Typography variant='subtitle2'>Normal tree</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MuiTreeView
          fullWidth
          options={[{ label: '四川', value: 51, children: [{ label: '成都', value: 5010 }] }]}
          label='cities'
          placeholder='请选择城市'
          onChange={(leaf, pathNodes): void => console.log(leaf, pathNodes)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant='subtitle2'>Replacer field name</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MuiTreeView
          fullWidth
          value={1011}
          fieldNames={{ label: 'name', value: 'id' }}
          options={options}
          label='cities'
          onChange={(leaf, pathNodes): void => console.log(leaf, pathNodes)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant='subtitle2'>Empty status</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MuiTreeView
          fullWidth
          options={[]}
          label='cities'
          placeholder='请选择城市'
          onChange={(leaf, path): void => console.log(leaf, path)}
        />
      </Grid>
    </Grid>
  )
}

export default TreeViewExample
