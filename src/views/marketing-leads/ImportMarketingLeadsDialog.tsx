'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'

// Action Imports
import { fetchAccountList } from '@/actions/accountActions'
import { importMarketingLeads } from '@/actions/marketingLeadActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import { AccountStatus, type AccountOutputData } from '@/types/accountTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const ImportMarketingLeadsDialog = ({ open, setOpen, closeAfterTransition = false, refresh }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [accounts, setAccounts] = useState<AccountOutputData[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const selectedAccounts = useMemo(
    () => accounts.filter(account => selectedIds.includes(Number(account.id))),
    [accounts, selectedIds]
  )
  
  const accountLabel = (account: AccountOutputData): string =>
    [account.channel.label, account.username, account.eId, account.userid].filter(Boolean).join(' / ')

  useEffect(() => {
    const loadAccounts = async (): Promise<void> => {
      setLoading(true)

      const res = await fetchAccountList({ page: 1, perPage: 1000, status: AccountStatus.ENABLED })

      if (!res.whenFailureRedirect().failed() && res.getContent()) {
        setAccounts(res.getContent().list)
      }

      setLoading(false)
    }

    if (open) {
      loadAccounts()
    }
  }, [open])

  const handleClose = (): void => {
    setFile(null)
    setSelectedIds([])
    setOpen(false)
  }

  const handleSubmit = async (): Promise<void> => {
    if (file === null) {
      toast.warning<string>('请选择导入文件')

      return
    }

    if (selectedIds.length <= 0) {
      toast.warning<string>('请选择线索账户')

      return
    }

    setSaving(true)

    const res = await importMarketingLeads({ file, accountIds: selectedIds })

    setSaving(false)

    if (!res.whenFailureRedirect().failed()) {
      toast.success<string>(res.body().msg, {
        autoClose: 1000,
        onClose: (): void => {
          handleClose()
          refresh()
        }
      })
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='import-marketing-leads-dialog-title'
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
      <DialogTitle id='import-marketing-leads-dialog-title'>
        <Typography variant='h5' component='span'>
          导入数据
        </Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              fullWidth
              type='file'
              label='导入文件'
              helperText='请上传表头为：客户姓名、客户手机号、搜索词、关键词 的 Excel 文件'
              onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                setFile(event.target.files?.[0] ?? null)
              }}
              slotProps={{
                htmlInput: {
                  accept: '.xlsx,.xls'
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
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
              renderInput={params => (
                <CustomTextField {...params} label='线索账户' placeholder='请选择导入后关联的线索账户' />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          取消
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={saving}>
          导入
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportMarketingLeadsDialog
