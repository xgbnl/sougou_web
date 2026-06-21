'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

// Action Imports
import { clearUserMarketingLeads } from '@/actions/userActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'

type Props = OpenDialogOnElementClickBaseProps & {
  userId: number | string
  username: string
  refresh: () => void
}

const ClearMarketingLeadsDialog = ({
  open,
  setOpen,
  closeAfterTransition = false,
  userId,
  username,
  refresh
}: Props) => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const handleClear = async (): Promise<void> => {
    const res = await clearUserMarketingLeads(userId)

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
      aria-labelledby='clear-marketing-leads-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='clear-marketing-leads-dialog-title'>
        <Typography variant='h5' component='span'>
          清空线索
        </Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Typography>确认清空用户「{username}」名下的所有线索吗？</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          取消
        </Button>
        <Button onClick={handleClear} variant='contained' color='warning'>
          清空
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ClearMarketingLeadsDialog
