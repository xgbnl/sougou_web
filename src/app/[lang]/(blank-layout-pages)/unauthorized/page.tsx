// React Imports
import type { ReactElement } from 'react'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import Unauthorized from '@views/Unauthorized'

// Configs Imports
import type { Locale } from '@/configs/i18n'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

type Params = {
  lang: Locale
}

const UnauthorizedPage = async (props: Promise<{ params: Params }>): Promise<ReactElement> => {
  // Props
  const { params } = await props
  const { lang } = await params

  // Vars
  const direction = 'ltr'
  const mode = await getServerMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <Unauthorized mode={mode} lang={lang} />
      </BlankLayout>
    </Providers>
  )
}

export default UnauthorizedPage
