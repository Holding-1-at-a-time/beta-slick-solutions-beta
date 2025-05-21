import type React from "react"
export default function RescheduleLayout({
  children,
  confirm,
}: {
  children: React.ReactNode
  confirm: React.ReactNode
}) {
  return (
    <>
      {children}
      {confirm}
    </>
  )
}
