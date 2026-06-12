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
import { deleteMarketingLead } from '@/actions/marketingLeadActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'

type Props = OpenDialogOnElementClickBaseProps & {
  leadId: number | string
  username: string
  phone: string
  refresh: () => void
}

const DeleteMarketingLeadDialog = ({
  open,
  setOpen,
  closeAfterTransition = false,
  leadId,
  username,
  phone,
  refresh
}: Props) => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const handleDelete = async (): Promise<void> => {
    const res = await deleteMarketingLead(leadId)

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
      aria-labelledby='delete-marketing-lead-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='delete-marketing-lead-dialog-title'>
        <Typography variant='h5' component='span'>
          删除线索
        </Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Typography>
          确认删除线索「{username || '-'} / {phone || '-'}」吗？
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          取消
        </Button>
        <Button onClick={handleDelete} variant='contained' color='error'>
          删除
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteMarketingLeadDialog
