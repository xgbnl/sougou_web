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
import { createFormFilter } from '@/actions/formFilterActions'

// Type Imports
import type { OpenDialogOnElementClickBaseProps } from '@/components/dialogs/OpenDialogOnElementClick'
import { FormFilterType, type FormFilterStoreInputData } from '@/types/formFilterTypes'

type Props = OpenDialogOnElementClickBaseProps & {
  refresh: () => void
}

const initialData: FormFilterStoreInputData = {
  type: FormFilterType.NAME,
  value: ''
}

const CreateFormFilterDialog = ({ open, setOpen, closeAfterTransition = false, refresh }: Props) => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormFilterStoreInputData>({
    defaultValues: initialData
  })
  const type = useWatch({ control, name: 'type' })

  const handleClose = (): void => {
    reset(initialData)
    setOpen(false)
  }

  const onSubmit: SubmitHandler<FormFilterStoreInputData> = async (data): Promise<void> => {
    const res = await createFormFilter({
      type: data.type,
      value: data.value.trim()
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
      aria-labelledby='create-form-filter-dialog-title'
      open={open}
      closeAfterTransition={closeAfterTransition}
      slotProps={{
        paper: {
          sx: { overflow: 'visible' }
        }
      }}
    >
      <DialogTitle id='create-form-filter-dialog-title'>
        <Typography variant='h5' component='span'>
          添加过滤项
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
                label='过滤类型'
                options={[
                  { label: '姓名', value: FormFilterType.NAME },
                  { label: '手机号', value: FormFilterType.PHONE }
                ]}
                value={type}
                onChange={(value): void => setValue('type', value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                fullWidth
                label='过滤内容'
                placeholder={type === FormFilterType.PHONE ? '请输入手机号' : '请输入姓名关键词'}
                {...register('value', { required: true })}
                {...(errors.value && { error: true, helperText: '过滤内容不能为空' })}
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

export default CreateFormFilterDialog
