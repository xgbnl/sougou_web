// React Imports
import type { ReactElement } from 'react'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Configs Imports
import type { Locale } from '@/configs/i18n'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

type Params = {
  lang: Locale
}

const NotFoundPage = async (props: Promise<{ params: Params }>): Promise<ReactElement> => {
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
        <NotFound lang={lang} mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
