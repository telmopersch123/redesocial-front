'use client'

import * as React from 'react'
import { Calendar } from '../../ui/calendar'

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
      />
    </>
  )
}
