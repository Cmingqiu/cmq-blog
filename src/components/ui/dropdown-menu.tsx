'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={containerRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ 
  children, 
  asChild 
}: { 
  children: React.ReactNode
  asChild?: boolean
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context) return null

  const props = {
    onClick: () => context.setOpen(!context.open),
    'aria-haspopup': 'true' as const,
    'aria-expanded': context.open,
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, props)
  }

  return (
    <button type="button" {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ 
  children, 
  className, 
  align = 'end' 
}: { 
  children: React.ReactNode
  className?: string
  align?: 'start' | 'end'
}) {
  const context = React.useContext(DropdownMenuContext)
  if (!context?.open) return null

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ 
  children, 
  className, 
  onClick,
  asChild
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
  asChild?: boolean
}) {
  const context = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    onClick?.()
    context?.setOpen(false)
  }

  const baseClassName = cn(
    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    className
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(baseClassName, (children.props as any).className),
      onClick: (e: React.MouseEvent) => {
        (children.props as any).onClick?.(e)
        handleClick()
      }
    })
  }

  return (
    <div className={baseClassName} onClick={handleClick}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-muted" />
}
