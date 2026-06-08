'use client'

// React Imports
import { useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import type { Locale as DateFnsLocale } from 'date-fns'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomTextField from '@core/components/mui/TextField'

// Configs Imports
import { i18n } from '@/configs/i18n'
import type { Locale } from '@/configs/i18n'
import { serializeDate } from '@/utils/carbon'

type CustomInputProps = TextFieldProps & {
  label?: string
  end: Date
  start: Date
}

const TextField = (props: { dateFormat: string } & CustomInputProps) => {
  const { label, start, end, dateFormat, ...rest } = props

  const startDate = format(start, dateFormat)
  const endDate = end !== null ? ` - ${format(end, dateFormat)}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`

  return <CustomTextField fullWidth {...rest} label={label} value={value} />
}

type Props = {
  onChange: (date: Pick<CustomInputProps, 'end' | 'start'>, format: string[]) => void
} & Partial<Omit<CustomInputProps, 'onChange'>>

const DateRange = ({ label, onChange, start, end }: Props) => {
  // States
  const [startDateRange, setStartDateRange] = useState<Date | null | undefined>(start ?? new Date())
  const [endDateRange, setEndDateRange] = useState<Date | null | undefined>(end ?? new Date())
  const { lang } = useParams<{ lang: Locale }>()

  const { locale, dateFormat } = useMemo<{ locale: DateFnsLocale; dateFormat: string }>(() => {
    const isDefaultLocale = lang === i18n.defaultLocale

    return {
      locale: isDefaultLocale ? zhCN : enUS,
      dateFormat: isDefaultLocale ? 'yyyy-MM-dd' : 'MM/dd/yyyy'
    }
  }, [lang])

  const handleOnChangeRange = (date: [Date | null, Date | null]) => {
    const [start, end] = date

    setStartDateRange(start)
    setEndDateRange(end)

    onChange({ start: start as Date, end: end as Date }, [serializeDate(start), serializeDate(end)])
  }

  return (
    <AppReactDatepicker
      locale={locale}
      selectsRange
      monthsShown={2}
      endDate={endDateRange as Date}
      selected={startDateRange}
      startDate={startDateRange as Date}
      shouldCloseOnSelect={false}
      id='date-range-picker-months'
      onChange={handleOnChangeRange}
      customInput={
        <TextField
          dateFormat={dateFormat}
          label={label}
          end={endDateRange as Date}
          start={startDateRange as Date}
          slotProps={{
            input: {
              endAdornment: <span className='tabler-calendar-time'></span>
            }
          }}
        />
      }
    />
  )
}

export default DateRange
