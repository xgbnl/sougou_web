// React Imports
import type { ReactElement } from 'react'

// Lib Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Component Imports
import AccountsPage from '@/views/accounts'
import MuiAlert from '@/views/MuiAlert'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { AccountOutputData } from '@/types/accountTypes'

const getAccountPageListForServer = async (): Promise<ResponseInterface<OutPutPort<AccountOutputData>>> => {
  return get('accounts', {
    params: {
      perPage: 10,
      page: 1
    }
  })
}

const Page = async (): Promise<ReactElement> => {
  const res = await getAccountPageListForServer()

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <AccountsPage total={0} list={[]} />
      </>
    )
  }

  return <AccountsPage total={res.getContent().total} list={res.getContent().list} />
}

export default Page
