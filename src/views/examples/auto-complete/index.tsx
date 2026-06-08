'use client'

// Components Imports
import GenericAutoComplete from '@components/mui/autocomplete/GenericAutoComplete'

// Type Imports
import type { Option } from '@/types/option'

// Vars
const enum Example {
  Alert,
  AppBar,
  Button,
  Card
}

const options: Option<Example>[] = [
  { label: 'Alert', value: Example.Alert },
  { label: 'AppBar', value: Example.AppBar },
  { label: 'Button', value: Example.Button },
  { label: 'Card', value: Example.Card }
]

type Union = 'enabled' | 'disabled'

const AutoCompleteExample = () => {
  // Hooks
  const handleChange = (newValue: Option<Example>[]): void => {
    console.log(newValue)
  }

  return (
    <>
      <div className='mb-4'>
        <GenericAutoComplete
          onChange={handleChange}
          options={options}
          fixed={Example.AppBar}
          label='Fixed tag'
          placeholder='Favorites'
        />
      </div>
      <div className='mb-4'>
        <GenericAutoComplete onChange={handleChange} options={options} label='Normal tag' placeholder='Favorites' />
      </div>
      <div className='mb-4'>
        <GenericAutoComplete
          onChange={handleChange}
          options={options}
          label='Limit tag'
          limitTags={2}
          placeholder='Favorites'
        />
      </div>
      <GenericAutoComplete
        onChange={(newValue: Option<Union>[]): void => console.log(newValue)}
        options={
          [
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled' }
          ] as Option<Union>[]
        }
        label='Union type tag'
        placeholder='Favorites'
      />
    </>
  )
}

export default AutoCompleteExample
