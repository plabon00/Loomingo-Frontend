import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
} from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
  // 1. Add the duration prop
  shimmerDuration?: string 
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 200,
  // 2. Set a default speed (e.g., "3s" for 3 seconds)
  shimmerDuration = "3s", 
  ...props
}) => {
  return (
    <span
      className={cn("relative inline-block mx-auto w-fit", className)}
      {...props}
    >
      <span className="text-black dark:text-white">{children}</span>

      <span
        style={
          {
            "--shiny-width": `${shimmerWidth}px`,
            // 3. Apply the custom duration directly to the animation
            animationDuration: shimmerDuration, 
          } as CSSProperties
        }
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none text-transparent",
          "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
          "bg-linear-to-r from-transparent via-purple-300 via-50% to-transparent"
        )}
      >
        {children}
      </span>
    </span>
  )
}