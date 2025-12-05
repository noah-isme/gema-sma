declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        autoplay?: boolean
        loop?: boolean
        speed?: number
        direction?: number
        mode?: 'normal' | 'bounce'
        background?: string
        intermission?: number
        hover?: boolean
        style?: React.CSSProperties
      },
      HTMLElement
    >
  }
}

export {}
