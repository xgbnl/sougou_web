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
import { resetUserPassword } from '@/actions/userActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import type { UserResetPasswordInputData } from '@/types/userTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  userId: number | string
}

type FormData = Omit<UserResetPasswordInputData, 'id'>

const initialData: FormData = {
  password: '',
  passwordConfirmation: ''
}

const ResetPasswordDialog = ({ open, setOpen, closeAfterTransition = false, userId }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: initialData
  })

  const handleClose = (): void => {
    reset(initialData)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<FormData> = async (data): Promise<void> => {
    const res = await resetUserPassword({ id: userId, ...data })

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
      aria-labelledby='reset-password-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='reset-password-dialog-title'>
        <Typography variant='h5' component='span'>
          重置密码
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
                type='password'
                label='新密码'
                placeholder='请输入新密码'
                {...register('password', { required: true })}
                {...(errors.password && { error: true, helperText: '新密码不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                type='password'
                label='确认密码'
                placeholder='请再次输入新密码'
                {...register('passwordConfirmation', {
                  required: true,
                  validate: value => value === watch('password')
                })}
                {...(errors.passwordConfirmation && { error: true, helperText: '两次输入的密码不一致' })}
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

export default ResetPasswordDialog
