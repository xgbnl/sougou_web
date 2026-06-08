// React Imports
import type { ReactElement } from 'react'

// Component Imports
import ImagePreview from '@components/mui/image-preview'

const Page = (): ReactElement => {
  return (
    <>
      <ImagePreview imageUrls={['/images/logos/react-logo-dark.svg']} />
      <ImagePreview imageUrls={['https://mui.com/static/images/avatar/2.jpg']} shape='circle' />
    </>
  )
}

export default Page
