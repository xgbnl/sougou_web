'use client'

// React Imports
import { useCallback, useState } from 'react'

// Components Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { FreeSoloAutoCompleteProps } from './types'

const FreeSoloAutoComplete = (props: FreeSoloAutoCompleteProps) => {
  // Props
  const {
    onChange,
    fullWidth,
    id = 'autocomplete-free-solo',
    options = [],
    freeSolo,
    limitTags,
    multiple,
    maxTags,
    value: controlledValue,
    defaultValue,
    getOptionLabel,
    ...textFieldParams
  } = props

  const isControlled = controlledValue !== undefined

  const [internalValue, setInternalValue] = useState<string[]>(() => {
    if (!Array.isArray(defaultValue)) {
      return []
    }

    return maxTags != null ? defaultValue.slice(0, maxTags) : defaultValue
  })

  const valueForMui: string[] | undefined = isControlled
    ? Array.isArray(controlledValue)
      ? maxTags != null
        ? controlledValue.slice(0, maxTags)
        : controlledValue
      : []
    : maxTags != null
      ? internalValue
      : undefined

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: string | string[] | null) => {
      const next = Array.isArray(newValue) ? newValue : newValue != null && newValue !== '' ? [String(newValue)] : []

      const capped = maxTags != null && next.length > maxTags ? next.slice(-maxTags) : next

      if (!isControlled && maxTags != null) {
        setInternalValue(capped)
      }

      onChange(capped)
    },
    [isControlled, maxTags, onChange]
  )

  return (
    <CustomAutocomplete
      {...{ id, options, fullWidth, limitTags, freeSolo, multiple, getOptionLabel }}
      {...(valueForMui !== undefined
        ? { value: valueForMui }
        : defaultValue !== undefined && maxTags == null
          ? { defaultValue }
          : {})}
      onChange={handleChange}
      renderInput={params => <CustomTextField {...params} {...textFieldParams} />}
    />
  )
}

export default FreeSoloAutoComplete
