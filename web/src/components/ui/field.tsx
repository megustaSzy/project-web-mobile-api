// components/ui/field.tsx
import * as React from "react"

export function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  )
}

export function FieldDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={`text-xs text-gray-500 ${className}`}>{children}</p>
}
