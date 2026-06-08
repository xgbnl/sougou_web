// React Imports
import type { ReactElement } from 'react'

// Libs Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Components Imports
import MuiAlert from '@/views/MuiAlert'

type User = {
  name: string
}

const Page = async (): Promise<ReactElement> => {
  const res = await get<ResponseInterface<User>>('errors/422')

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <div>
          <h3>Fetcher</h3>
        </div>
      </>
    )
  }

  return (
    <div>
      <h3>Fetcher</h3>
    </div>
  )
}

export default Page
