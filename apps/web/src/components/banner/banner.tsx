import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type BannerProps = {
  url?: string
} & ComponentProps<'div'>

export const Banner = ({ url, className, ...props }: BannerProps) => {
  return (
    <div
      {...props}
      className={cn(
        'aspect-video w-full overflow-hidden border bg-muted shadow md:rounded-lg',
        className,
      )}
    >
      <div
        style={{
          backgroundImage: `url('${url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="h-full w-full brightness-50"
        data-testid="banner"
      />
    </div>
  )
}
