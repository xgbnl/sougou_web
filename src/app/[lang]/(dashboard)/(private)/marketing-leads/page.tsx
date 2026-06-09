// React Imports
import type { ReactElement } from 'react'

// Lib Imports
import { get } from '@/libs/http/next'
import type { ResponseInterface } from '@/libs/http/types'

// Component Imports
import MarketingLeadsPage from '@/views/marketing-leads'
import MuiAlert from '@/views/MuiAlert'

// Type Imports
import type { OutPutPort } from '@/types/queryTypes'
import type { MarketingLeadOutputData } from '@/types/marketingLeadTypes'

const getMarketingLeadPageListForServer = async (): Promise<ResponseInterface<OutPutPort<MarketingLeadOutputData>>> => {
  return get('marketing-leads', {
    params: {
      perPage: 100,
      page: 1
    }
  })
}

const Page = async (): Promise<ReactElement> => {
  const res = await getMarketingLeadPageListForServer()

  if (res.whenFailureRedirect().failed()) {
    return (
      <>
        <MuiAlert message={res.getMessage()} />
        <MarketingLeadsPage total={0} list={[]} />
      </>
    )
  }

  return <MarketingLeadsPage total={res.getContent().total} list={res.getContent().list} />
}

export default Page
