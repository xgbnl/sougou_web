'use client'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'

// Third-party Imports
import { useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'

// Action Imports
import { createUser } from '@/actions/userActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import type { UserStoreOutputData } from '@/types/userTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const initialData: UserStoreOutputData = {
  displayName: '',
  username: '',
  password: ''
}

const CreateUserDialog = ({ open, setOpen, closeAfterTransition = false, refresh }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserStoreOutputData>({
    defaultValues: initialData
  })

  const handleClose = (): void => {
    reset(initialData)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<UserStoreOutputData> = async (data): Promise<void> => {
    const res = await createUser(data)

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
      aria-labelledby='create-user-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='create-user-dialog-title'>
        <Typography variant='h5' component='span'>
          新建用户
        </Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='用户名'
                placeholder='请输入用户名'
                {...register('username', { required: true })}
                {...(errors.username && { error: true, helperText: '用户名不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='显示名称'
                placeholder='请输入显示名称'
                {...register('displayName', { required: true })}
                {...(errors.displayName && { error: true, helperText: '显示名称不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                type='password'
                label='密码'
                placeholder='请输入密码'
                {...register('password', { required: true })}
                {...(errors.password && { error: true, helperText: '密码不能为空' })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            取消
          </Button>
          <Button type='submit' variant='contained'>
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateUserDialog
