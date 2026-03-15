'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/getMe'
import type { dailyBackType } from '../../../types'
import { Calendar } from '../../ui/calendar'

interface PropsCalendarDaily {
  setValidedDaily: React.Dispatch<React.SetStateAction<boolean>>
  setDailyData: React.Dispatch<React.SetStateAction<dailyBackType | undefined>>
  setLoadingDailyCalendar: React.Dispatch<React.SetStateAction<boolean>>
  setToday: React.Dispatch<React.SetStateAction<boolean>>
}

export function CalendaryComponent({
  setDailyData,
  setValidedDaily,
  setLoadingDailyCalendar,
  setToday,
}: PropsCalendarDaily) {
  const today = new Date()
  const { user } = useAuth()
  const navigate = useNavigate()
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
          if (new Date().getDate() === selectedDate.getDate()) {
            setValidedDaily(true)
            setDailyData(data)
          } else {
            setDailyData(undefined)
            setValidedDaily(true)
          }
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
  useEffect(() => {
    setToday(date?.toDateString() === today.toDateString())
  }, [date])

  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          if (!user) return navigate('/auth')
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
