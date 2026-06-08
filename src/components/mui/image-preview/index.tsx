'use client'

// React Imports
import { useState, useRef } from 'react'
import type { ReactElement, WheelEvent } from 'react'

// MUI Imports
import Modal from '@mui/material/Modal'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Close from '@mui/icons-material/Close'
import ZoomIn from '@mui/icons-material/ZoomIn'
import ZoomOut from '@mui/icons-material/ZoomOut'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack from '@mui/icons-material/ArrowBack'

// Props 类型定义
interface Props {
  imageUrls: string[]
  shape?: 'circle' | 'rounded' | 'square'
}

const ImagePreview = ({ imageUrls, shape = 'square' }: Props): ReactElement => {
  // States
  const [open, setOpen] = useState<boolean>(false)
  const [scale, setScale] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Hooks
  const handleOpen = (): void => setOpen(true)

  const handleClose = (): void => {
    setOpen(false)
    setScale(1) // Reset scale when closing
  }

  const handleZoomIn = (): void => setScale(prev => Math.min(prev + 0.1, 3))
  const handleZoomOut = (): void => setScale(prev => Math.max(prev - 0.1, 1))

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()

    if (event.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleNext = (): void => {
    if (currentIndex < imageUrls.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setScale(1) // Reset scale when changing image
    }
  }

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setScale(1) // Reset scale when changing image
    }
  }

  // 计算图片的样式
  const imageStyle: Record<string, string> = {
    transform: `scale(${scale})`,
    transition: 'transform 0.1s ease', // 优化缩放性能
    maxWidth: '90%',
    maxHeight: '90%'
  }

  // 固定大小的样式
  const fixedSizeStyle: Record<string, string> = {
    width: '100px', // 固定宽度
    height: '100px', // 固定高度
    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '16px' : '0',
    overflow: 'hidden'
  }

  return (
    <div>
      <Box
        sx={{
          ...fixedSizeStyle,
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onClick={handleOpen}
      >
        <img
          src={imageUrls[0]}
          alt='Preview'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover' // 保持图片比例
          }}
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            overflow: 'hidden'
          }}
          onWheel={handleWheel}
        >
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}>
            <Close />
          </IconButton>
          {currentIndex > 0 && (
            <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 16, color: 'white' }}>
              <ArrowBack />
            </IconButton>
          )}
          {currentIndex < imageUrls.length - 1 && (
            <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 16, color: 'white' }}>
              <ArrowForward />
            </IconButton>
          )}
          <img ref={imgRef} src={imageUrls[currentIndex]} alt='Modal' style={imageStyle} />
          <Box sx={{ position: 'absolute', bottom: 16, display: 'flex', gap: 1 }}>
            <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
              <ZoomOut />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default ImagePreview
