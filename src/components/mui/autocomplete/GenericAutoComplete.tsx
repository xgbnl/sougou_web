'use client'

// React Imports
import { useMemo, useState, type ReactElement } from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'

// Components Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'

// Type Imports
import type { GenericAutoCompleteProps } from './types'
import type { Option } from '@/types/option'

export default function GenericAutoComplete<T>(
  props: GenericAutoCompleteProps<T> & { value?: Option<T>[] }
): ReactElement {
  // Props
  const {
    fixed,
    value: controlledValue,
    options,
    label,
    placeholder,
    id,
    limitTags,
    onChange,
    multiple = true
  } = props

  // States
  const fixedOption = useMemo(() => options.find(option => option.value === fixed), [fixed, options])
  const isMultiple = multiple !== false

  // Uncontrolled fallback value; fixed option is still derived.
  const [selectedValue, setSelectedValue] = useState<Option<T>[]>([])
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : selectedValue

  const value = useMemo(
    () =>
      fixedOption ? [fixedOption, ...currentValue.filter(option => option.value !== fixedOption.value)] : currentValue,
    [currentValue, fixedOption]
  )

  const normalizeToArray = (newValue: Option<T> | Option<T>[] | null): Option<T>[] => {
    if (Array.isArray(newValue)) return newValue
    if (newValue == null) return []

    return [newValue]
  }

  const handleChange = (newValue: Option<T> | Option<T>[] | null): void => {
    const normalized = normalizeToArray(newValue)
    const nextSelected = fixedOption ? normalized.filter(option => option.value !== fixedOption.value) : normalized
    const merge = fixedOption ? [fixedOption, ...nextSelected] : nextSelected

    if (!isControlled) {
      setSelectedValue(nextSelected)
    }

    onChange(merge)
  }

  return (
    <CustomAutocomplete
      {...{ limitTags, options, multiple }}
      value={isMultiple ? value : (value[0] ?? null)}
      getOptionLabel={(item: Option<T>): string => item.label || ''}
      isOptionEqualToValue={(option, selected) => option.value === selected.value}
      renderInput={params => <CustomTextField {...params} {...{ label, placeholder, id }} />}
      onChange={(_, newValue) => handleChange(newValue as Option<T> | Option<T>[] | null)}
      {...(isMultiple
        ? {
            renderValue: (
              tagValue: Option<T>[] | Option<T>,
              getItemProps: (params: { index: number }) => Record<string, unknown>
            ) =>
              Array.isArray(tagValue)
                ? tagValue.map((option, index) => (
                    <Chip
                      label={option.label}
                      {...getItemProps({ index })}
                      disabled={fixedOption ? option.value === fixedOption.value : false}
                      key={`${String(option.value)}-${index}`}
                      size='small'
                    />
                  ))
                : null
          }
        : {})}
    />
  )
}
