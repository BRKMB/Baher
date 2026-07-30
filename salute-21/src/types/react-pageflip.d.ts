declare module 'react-pageflip' {
  import type { ReactNode, Ref } from 'react'

  export type HTMLFlipBookProps = {
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    drawShadow?: boolean
    flippingTime?: number
    usePortrait?: boolean
    startZIndex?: number
    autoSize?: boolean
    maxShadowOpacity?: number
    showCover?: boolean
    mobileScrollSupport?: boolean
    clickEventForward?: boolean
    useMouseEvents?: boolean
    swipeDistance?: number
    showPageCorners?: boolean
    disableFlipByClick?: boolean
    className?: string
    style?: React.CSSProperties
    children?: ReactNode
    startPage?: number
    onFlip?: (e: { data: number }) => void
    onChangeOrientation?: (e: { data: string }) => void
    onChangeState?: (e: { data: string }) => void
    onInit?: (e?: unknown) => void
    ref?: Ref<unknown>
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<HTMLFlipBookProps>
  export default HTMLFlipBook
}
