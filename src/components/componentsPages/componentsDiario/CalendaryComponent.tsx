'use client'

import * as React from 'react'
import { useState } from 'react'
import type { dailyBackType } from '../../../types'
import { Calendar } from '../../ui/calendar'

interface PropsCalendarDaily {
  setValidedDaily: React.Dispatch<React.SetStateAction<boolean>>
  setDailyData: React.Dispatch<React.SetStateAction<dailyBackType | undefined>>
  setLoadingDailyCalendar: React.Dispatch<React.SetStateAction<boolean>>
}

export function CalendaryComponent({
  setDailyData,
  setValidedDaily,
  setLoadingDailyCalendar,
}: PropsCalendarDaily) {
  const today = new Date()

  const [date, setDate] = useState<Date | undefined>(today)

  const tenYearsAgo = new Date(
    today.getFullYear() - 20,
    today.getMonth(),
    today.getDate()
  )

  const fetchDailyEntry = async (selectedDate: Date) => {
    setLoadingDailyCalendar(true)

    try {
      const dateString = selectedDate.toLocaleDateString('en-CA')

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/getDailyByDate/${dateString}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.ok) {
        const data = await res.json()

        if (data) {
          setValidedDaily(false)
          setDailyData(data)
        } else {
          setDailyData(undefined)
          setValidedDaily(true)
        }
      } else {
        setDailyData(undefined)
        setValidedDaily(true)
      }
    } catch (error) {
      console.log(error)
      setDailyData(undefined)
      setValidedDaily(true)
    } finally {
      setLoadingDailyCalendar(false)
    }
  }

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate)
          fetchDailyEntry(newDate || new Date())
        }}
        captionLayout="dropdown"
        startMonth={tenYearsAgo}
        disabled={[{ after: today }]}
      />
    </>
  )
}
