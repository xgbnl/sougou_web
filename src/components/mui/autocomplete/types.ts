// MUI Imports
import type { AutocompleteProps, BaseTextFieldProps, UseAutocompleteProps } from '@mui/material'

// Type Imports
import type { Option } from '@/types/option'

export type FreeSoloAutoCompleteProps = {
  onChange: (newValue: string[]) => void
  /** 最多可选/可输入的标签条数（与 MUI `limitTags` 仅折叠展示无关） */
  maxTags?: number
} & Pick<
  BaseTextFieldProps,
  'label' | 'id' | 'placeholder' | 'error' | 'helperText' | 'required' | 'onBlur' | 'ref' | 'name'
> &
  Partial<Pick<UseAutocompleteProps<string, boolean, boolean, boolean>, 'options' | 'getOptionLabel'>> &
  Pick<
    AutocompleteProps<string, boolean, boolean, boolean>,
    'limitTags' | 'freeSolo' | 'fullWidth' | 'multiple' | 'value' | 'defaultValue'
  >

export type GenericAutoCompleteProps<T> = {
  fixed?: T
  value?: Option<T>[]
  options: Option<T>[]
  onChange: (newValue: Option<T>[]) => void
} & Pick<BaseTextFieldProps, 'label' | 'placeholder' | 'id' | 'fullWidth' | 'error' | 'helperText' | 'required'> &
  Pick<
    AutocompleteProps<Option<T>, boolean | undefined, boolean | undefined, boolean | undefined, React.ElementType>,
    'limitTags' | 'multiple'
  >
