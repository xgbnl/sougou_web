// React Imports
import type { ReactElement } from 'react'

// Lib Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Component Imports
import FormFiltersPage from '@/views/form-filters'
import MuiAlert from '@/views/MuiAlert'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { FormFilterOutputData } from '@/types/formFilterTypes'

const getFormFilterPageListForServer = async (): Promise<ResponseInterface<OutPutPort<FormFilterOutputData>>> => {
  return get('form-filters', {
    params: {
      perPage: 10,
      page: 1
    }
  })
}

const Page = async (): Promise<ReactElement> => {
  const res = await getFormFilterPageListForServer()

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <FormFiltersPage total={0} list={[]} />
      </>
    )
  }

  return <FormFiltersPage total={res.getContent().total} list={res.getContent().list} />
}

export default Page
