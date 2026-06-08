// React Imports
import type { ReactElement } from 'react'

// Lib Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Component Imports
import UsersPage from '@/views/users'
import MuiAlert from '@/views/MuiAlert'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { UserOutputData } from '@/types/userTypes'

const getUserPageListForServer = async (): Promise<ResponseInterface<OutPutPort<UserOutputData>>> => {
  return get('users', {
    params: {
      perPage: 10,
      page: 1
    }
  })
}

const Page = async (): Promise<ReactElement> => {
  const res = await getUserPageListForServer()

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <UsersPage total={0} list={[]} />
      </>
    )
  }

  return <UsersPage total={res.getContent().total} list={res.getContent().list} />
}

export default Page
