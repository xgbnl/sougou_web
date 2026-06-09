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
import { createMarketingLead } from '@/actions/marketingLeadActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import type { MarketingLeadStoreInputData } from '@/types/marketingLeadTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const localDateTime = (): string => {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const initialData: MarketingLeadStoreInputData = {
  createTime: localDateTime(),
  siteName: '',
  customerName: '',
  customerTel: '',
  adSearchWord: '',
  adKeyword: ''
}

const CreateMarketingLeadDialog = ({ open, setOpen, closeAfterTransition = false, refresh }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MarketingLeadStoreInputData>({
    defaultValues: initialData
  })

  const handleClose = (): void => {
    reset({ ...initialData, createTime: localDateTime() })
    setOpen(false)
  }

  const onSubmit: SubmitHandler<MarketingLeadStoreInputData> = async (data): Promise<void> => {
    const res = await createMarketingLead({
      ...data,
      createTime: data.createTime.replace('T', ' ') + (data.createTime.length === 16 ? ':00' : '')
    })

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
      aria-labelledby='create-marketing-lead-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='create-marketing-lead-dialog-title'>
        <Typography variant='h5' component='span'>
          添加线索
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
                type='datetime-local'
                label='线索时间'
                {...register('createTime', { required: true })}
                {...(errors.createTime && { error: true, helperText: '线索时间不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='落地页名称'
                placeholder='请输入落地页名称'
                {...register('siteName', { required: true })}
                {...(errors.siteName && { error: true, helperText: '落地页名称不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='客户姓名'
                placeholder='请输入客户姓名'
                {...register('customerName', { required: true })}
                {...(errors.customerName && { error: true, helperText: '客户姓名不能为空' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='客户手机号'
                placeholder='请输入客户手机号'
                {...register('customerTel', { required: true, maxLength: 11 })}
                {...(errors.customerTel && { error: true, helperText: '客户手机号不能为空，最多 11 位' })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='搜索词'
                placeholder='请输入搜索词'
                {...register('adSearchWord')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='关键词'
                placeholder='请输入关键词'
                {...register('adKeyword')}
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

export default CreateMarketingLeadDialog
