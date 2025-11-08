'use client'

import * as React from 'react'
import { Calendar } from '../../ui/calendar'

export function Calendario() {
  const today = new Date()

  const [date, setDate] = React.useState<Date | undefined>(today)
  const tenYearsAgo = new Date(
    today.getFullYear() - 20,
    today.getMonth(),
    today.getDate()
  )
  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={tenYearsAgo}
        disabled={[{ after: today }]}
      />
    </>
  )
}
