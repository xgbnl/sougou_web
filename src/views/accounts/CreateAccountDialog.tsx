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
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import EnumRadio from '@/components/mui/enum-radio'

// Action Imports
import { createAccount } from '@/actions/accountActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import { AccountStatus, type AccountStoreInputData } from '@/types/accountTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const initialData: AccountStoreInputData = {
  username: '',
  eId: '',
  userid: 0,
  secret: '',
  status: AccountStatus.ENABLED
}

const CreateAccountDialog = ({ open, setOpen, closeAfterTransition = false, refresh }: Props) => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AccountStoreInputData>({
    defaultValues: initialData
  })

  const handleClose = (): void => {
    reset(initialData)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<AccountStoreInputData> = async (data): Promise<void> => {
    const res = await createAccount(data)

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
      aria-labelledby='create-account-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='create-account-dialog-title'>
        <Typography variant='h5' component='span'>
          创建账户
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
                label='点睛id'
                placeholder='请输入点睛id'
                {...register('eId', { required: true })}
                {...(errors.eId && { error: true, helperText: '点睛id不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                type='number'
                label='UserId'
                placeholder='请输入UserId'
                helperText={errors.userid ? 'UserId不能为空' : '用于接口调用'}
                {...register('userid', { required: true, valueAsNumber: true })}
                {...(errors.userid && { error: true })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='secret'
                placeholder='请输入secret'
                helperText={errors.secret ? 'secret不能为空' : '用于接口调用'}
                {...register('secret', { required: true })}
                {...(errors.secret && { error: true })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <EnumRadio
                label='状态'
                options={[
                  { label: '启用', value: AccountStatus.ENABLED },
                  { label: '禁用', value: AccountStatus.DISABLED }
                ]}
                value={useWatch({ control, name: 'status' })}
                onChange={(value): void => setValue('status', Number(value))}
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

export default CreateAccountDialog
