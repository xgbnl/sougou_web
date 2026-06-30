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
import { AccountChannel, AccountStatus, type AccountStoreInputData } from '@/types/accountTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const initialData: AccountStoreInputData = {
  channel: AccountChannel.QI_HU,
  username: '',
  eId: '',
  userid: undefined,
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
  const channel = useWatch({ control, name: 'channel' })
  const status = useWatch({ control, name: 'status' })
  const isSimpleAccount = channel === AccountChannel.BAIDU || channel === AccountChannel.SOUGOU

  const handleClose = (): void => {
    reset(initialData)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<AccountStoreInputData> = async (data): Promise<void> => {
    const inputData = isSimpleAccount ? { ...data, eId: undefined, userid: undefined, secret: undefined } : data
    const res = await createAccount(inputData)

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
              <EnumRadio
                label='账户渠道'
                options={[
                  { label: '360', value: AccountChannel.QI_HU },
                  { label: '百度', value: AccountChannel.BAIDU },
                  { label: '搜狗', value: AccountChannel.SOUGOU }
                ]}
                value={channel}
                onChange={(value): void => setValue('channel', value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label={isSimpleAccount ? '账户名' : '用户名'}
                placeholder={isSimpleAccount ? '请输入账户名' : '请输入用户名'}
                {...register('username', { required: true })}
                {...(errors.username && {
                  error: true,
                  helperText: isSimpleAccount ? '账户名不能为空' : '用户名不能为空'
                })}
              />
            </Grid>
            {!isSimpleAccount ? (
              <>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='点睛id'
                    placeholder='请输入点睛id'
                    {...register('eId', { required: !isSimpleAccount })}
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
                    {...register('userid', { required: !isSimpleAccount, valueAsNumber: true })}
                    {...(errors.userid && { error: true })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    fullWidth
                    label='secret'
                    placeholder='请输入secret'
                    helperText={errors.secret ? 'secret不能为空' : '用于接口调用'}
                    {...register('secret', { required: !isSimpleAccount })}
                    {...(errors.secret && { error: true })}
                  />
                </Grid>
              </>
            ) : null}
            <Grid size={{ xs: 12 }}>
              <EnumRadio
                label='状态'
                options={[
                  { label: '启用', value: AccountStatus.ENABLED },
                  { label: '禁用', value: AccountStatus.DISABLED }
                ]}
                value={status}
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
