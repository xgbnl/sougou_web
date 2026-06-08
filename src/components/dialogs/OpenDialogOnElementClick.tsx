'use client'

// React Imports
import { useState } from 'react'
import type { ComponentType, Dispatch, MouseEvent, SetStateAction } from 'react'

export type OpenDialogOnElementClickBaseProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  closeAfterTransition?: boolean
}

/** 允许 MUI Button 等组件的 props，同时避免在 TSX 里写泛型组件标签 */
type BaseElementProps = Record<string, unknown> & {
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

type OpenDialogOnElementClickProps<DialogProps extends object = object> = {
  element: ComponentType<BaseElementProps>
  dialog: ComponentType<DialogProps & OpenDialogOnElementClickBaseProps>
  elementProps?: BaseElementProps
  dialogProps?: DialogProps
}

function OpenDialogOnElementClick<DialogProps extends object = object>(
  props: OpenDialogOnElementClickProps<DialogProps>
) {
  // Props
  const { element: Element, dialog: Dialog, elementProps, dialogProps } = props

  // States
  const [open, setOpen] = useState(false)

  // Extract onClick from elementProps
  const { onClick: elementOnClick, ...restElementProps } = elementProps ?? {}

  // Handle onClick event
  const handleOnClick = (e: MouseEvent<HTMLElement>) => {
    elementOnClick?.(e)
    e.stopPropagation()

    setOpen(true)
  }

  return (
    <>
      <Element {...({ ...restElementProps, onClick: handleOnClick } as BaseElementProps)} />
      {open ? (
        <Dialog
          {...({
            open,
            setOpen,
            closeAfterTransition: false,
            ...(dialogProps ?? {})
          } as DialogProps & {
            open: boolean
            setOpen: Dispatch<SetStateAction<boolean>>
            closeAfterTransition?: boolean
          })}
        />
      ) : null}
    </>
  )
}

export default OpenDialogOnElementClick
