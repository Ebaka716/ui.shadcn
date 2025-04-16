import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(110_49%_34%_/_0.15)] text-[hsl(110_49%_34%)] dark:bg-[hsl(110_40%_45%_/_0.15)] dark:text-[hsl(110_40%_45%)] [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-black/10 text-black [a&]:hover:bg-black/20 dark:bg-white/10 dark:text-white",
        destructive:
          "border-transparent bg-[hsl(0_84.2%_60.2%_/_0.15)] text-[hsl(0_84.2%_60.2%)] dark:bg-[hsl(0_62.8%_30.6%_/_0.15)] dark:text-[hsl(0_62.8%_30.6%)] [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
