// React Imports
import type { ReactElement } from 'react'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import Unauthenticated from '@/views/Unauthenticated'

// Configs Imports
import type { Locale } from '@/configs/i18n'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

type Params = {
  lang: Locale
}

const UnauthenticatedPage = async (props: Promise<{ params: Params }>): Promise<ReactElement> => {
  // Props
  const { params } = await props
  const { lang } = await params

  console.log('[UnauthenticatedPage] Rendering page for lang:', lang)

  // Vars
  const direction = 'ltr'
  const mode = await getServerMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <Unauthenticated mode={mode} lang={lang} />
      </BlankLayout>
    </Providers>
  )
}

export default UnauthenticatedPage
