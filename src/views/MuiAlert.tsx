'use client'

// React Imports
import { useState } from 'react'
import type { ReactNode } from 'react'

// MUI Imports
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export default function MuiAlert({ message }: { message: string }): ReactNode {
  // States
  const [open, setOpen] = useState<boolean>(true)

  return (
    <Collapse in={open}>
      <Alert
        severity='error'
        action={
          <IconButton aria-label='close' color='inherit' size='small' onClick={(): void => setOpen(false)}>
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  )
}
