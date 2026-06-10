'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'

// Action Imports
import { fetchUserAccounts, syncUserAccounts } from '@/actions/userActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import type { UserAssignableAccount } from '@/types/userTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  userId: number | string
}

const AssignAccountsDialog = ({ open, setOpen, closeAfterTransition = false, userId }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<UserAssignableAccount[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const selectedAccounts = useMemo(
    () => accounts.filter(account => selectedIds.includes(Number(account.id))),
    [accounts, selectedIds]
  )
  const accountLabel = (account: UserAssignableAccount): string =>
    [account.channel.label, account.username, account.eId, account.userid].filter(Boolean).join(' / ')

  useEffect(() => {
    const loadAccounts = async (): Promise<void> => {
      setLoading(true)

      const res = await fetchUserAccounts(userId)

      if (!res.whenFailureRedirect().failed() && res.getContent()) {
        setAccounts(res.getContent().accounts)
        setSelectedIds(res.getContent().selectedIds)
      }

      setLoading(false)
    }

    if (open) {
      loadAccounts()
    }
  }, [open, userId])

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleSubmit = async (): Promise<void> => {
    setSaving(true)

    const res = await syncUserAccounts({ id: userId, accountIds: selectedIds })

    setSaving(false)

    if (!res.whenFailureRedirect().failed()) {
      toast.success<string>(res.body().msg, {
        autoClose: 1000,
        onClose: handleClose
      })
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='assign-accounts-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      fullWidth
      maxWidth='sm'
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='assign-accounts-dialog-title'>
        <Typography variant='h5' component='span'>
          分配线索账户
        </Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Autocomplete
          multiple
          disableCloseOnSelect
          loading={loading}
          options={accounts}
          value={selectedAccounts}
          isOptionEqualToValue={(option, value): boolean => option.id === value.id}
          getOptionLabel={accountLabel}
          onChange={(_, value): void => {
            setSelectedIds(value.map(account => Number(account.id)))
          }}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props

            return (
              <li key={key} {...optionProps}>
                <Checkbox checked={selected} sx={{ mr: 2 }} />
                {accountLabel(option)}
              </li>
            )
          }}
          renderInput={params => <CustomTextField {...params} label='线索账户' placeholder='请选择线索账户' />}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          取消
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={saving}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignAccountsDialog
