'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement } from 'react'

// MUI Imports
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import { toast } from 'react-toastify'

// Action Imports
import { editAccountStatus } from '@/actions/accountActions'

// Type Imports
import { AccountStatus, type AccountOutputData } from '@/types/accountTypes'

const EditStatus = (props: AccountOutputData): ReactElement => {
  const { id, status } = props
  const [checked, setChecked] = useState<boolean>(status.value === AccountStatus.ENABLED)

  const handleStatusChange = async (): Promise<void> => {
    const nextStatus = checked ? AccountStatus.DISABLED : AccountStatus.ENABLED

    setChecked(!checked)

    const res = await editAccountStatus({ id, status: nextStatus })

    if (!res.whenFailureRedirect().failed()) {
      toast.success<string>(res.body().msg)
    }
  }

  return (
    <FormGroup row>
      <FormControlLabel
        control={<Switch color='success' onClick={handleStatusChange} checked={checked} />}
        label='启用'
      />
    </FormGroup>
  )
}

export default EditStatus
