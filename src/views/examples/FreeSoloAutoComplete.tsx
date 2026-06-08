// Components Imports
import FreeSoloAutoComplete from '@components/mui/autocomplete/FreeSoloAutoComplete'

const FreeSoloAutoCompleteExample = () => {
  return (
    <FreeSoloAutoComplete
      placeholder='Favorites'
      onChange={(newValue: string[]): void => console.log(newValue)}
      label='Free solo'
    />
  )
}

export default FreeSoloAutoCompleteExample
