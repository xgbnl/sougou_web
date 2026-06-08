'use client'

// React Imports
import { useMemo } from 'react'

// Types Imports
import type { FieldNames, InternalFieldNames } from './types'

function toInternal(
  labelKey: string | undefined,
  valueKey: string | undefined,
  childrenKey: string | undefined
): InternalFieldNames {
  const label = labelKey ?? 'label'
  const value = valueKey ?? 'value'
  const children = childrenKey ?? 'children'

  return {
    label,
    value,
    children,
    key: value
  }
}

const useFieldName = (fieldNames?: FieldNames): InternalFieldNames => {
  const lk = fieldNames?.label
  const vk = fieldNames?.value
  const ck = fieldNames?.children

  return useMemo(() => toInternal(lk, vk, ck), [lk, vk, ck])
}

export default useFieldName
