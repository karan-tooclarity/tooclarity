"use client"

import * as React from "react"
import * as _DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function _Dialog({
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Root>) {
  return <_DialogPrimitive.Root data-slot="_Dialog" {...props} />
}

function _DialogTrigger({
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Trigger>) {
  return <_DialogPrimitive.Trigger data-slot="_Dialog-trigger" {...props} />
}

function _DialogPortal({
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Portal>) {
  return <_DialogPrimitive.Portal data-slot="_Dialog-portal" {...props} />
}

function _DialogClose({
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Close>) {
  return <_DialogPrimitive.Close data-slot="_Dialog-close" {...props} />
}

function _DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Overlay>) {
  return (
    <_DialogPrimitive.Overlay
      data-slot="_Dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        className
      )}
      {...props}
    />
  )
}
function _DialogContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <_DialogPortal>
      <_DialogPrimitive.Content
        data-slot="_Dialog-content"
        className={cn(
          // Position: below the stepper with gap
          "fixed z-50 left-1/2 top-[calc(80px+64px+40px)] -translate-x-1/2",
          // Explanation: 
          // 80px = navbar height (md)
          // 64px = stepper height
          // 40px = gap
          // Sizing
          "w-[95vw] sm:w-[90vw] md:w-[552px]",
          "max-h-[75vh]", // restrict height
          // Scroll
          "overflow-y-auto",
          // Style
          "rounded-[24px] p-4 sm:p-6 bg-white shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <_DialogPrimitive.Close
            data-slot="_Dialog-close"
            className="absolute top-4 right-4 opacity-70 hover:opacity-100"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </_DialogPrimitive.Close>
        )}
      </_DialogPrimitive.Content>
    </_DialogPortal>
  )
}

function _DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="_Dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function _DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="_Dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function _DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Title>) {
  return (
    <_DialogPrimitive.Title
      data-slot="_Dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function _DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof _DialogPrimitive.Description>) {
  return (
    <_DialogPrimitive.Description
      data-slot="_Dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  _Dialog,
  _DialogClose,
  _DialogContent,
  _DialogDescription,
  _DialogFooter,
  _DialogHeader,
  _DialogOverlay,
  _DialogPortal,
  _DialogTitle,
  _DialogTrigger,
}


