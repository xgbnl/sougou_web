'use client'

// React Imports
import type { ReactElement, ReactNode } from 'react'

// MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { alpha, styled } from '@mui/material/styles'
import type { ToolbarProps } from '@mui/material/Toolbar'

// Type Imports
import type { TableSlotProp } from '@components/mui/table/types'

type EnhancedTableToolbarProps<T> = {
  numSelected: number
  onDelete?: () => void
  selected: T[]
} & TableSlotProp<T>

const ToolbarStyled = styled(Toolbar)<ToolbarProps>(() => ({
  '&.MuiToolbar-root': {
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    minHeight: '90px'
  }
}))

function ToolbarContent<T>(props: EnhancedTableToolbarProps<T>): ReactNode {
  const { numSelected, onDelete, slotProps, selected } = props

  if (numSelected > 0) {
    return typeof slotProps?.effectActions === 'function' ? (
      slotProps.effectActions(selected)
    ) : (
      <Tooltip title='Delete'>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    )
  }

  if (typeof slotProps?.filter === 'function') {
    return slotProps.filter()
  }

  return null
}

export default function MuiTableToolbar<T>(props: EnhancedTableToolbarProps<T>): ReactElement {
  const { numSelected, onDelete, slotProps, selected } = props

  return (
    <ToolbarStyled
      sx={[
        numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 50%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 50%' }} variant='h6' id='tableTitle' component='div'>
          {slotProps?.slot ? slotProps.slot() : 'Nutrition'}
        </Typography>
      )}
      <ToolbarContent numSelected={numSelected} onDelete={onDelete} slotProps={slotProps} selected={selected} />
    </ToolbarStyled>
  )
}
