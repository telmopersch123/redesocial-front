'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useState } from 'react'
import type { dateUserGrapchis } from '../../../types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { ConfigGraphics } from './componentsGraphcis/ConfigGraphics'
import { Metrics } from './componentsGraphcis/Metrics'

const chartConfig = {
  emotionalDiary: {
    label: 'Desempenho Sentimental',
    color: '#6366f1', // índigo - introspecção, emoção, profundidade
  },
  lvlenergy: {
    label: 'Nível de Energia',
    color: '#f59e0b', // âmbar - vitalidade, ativação, energia
  },
  lvlanxiety: {
    label: 'Nível de Ansiedade',
    color: '#ef4444', // vermelho - alerta, tensão, ansiedade
  },
} satisfies ChartConfig

interface ChartDataProps {
  setTimeRange: React.Dispatch<React.SetStateAction<string>>
  timeRange: string
  setSelectedWidth: React.Dispatch<React.SetStateAction<number>>
  datesUserGraphics: dateUserGrapchis[]
}

export function ChartDailyInteractive({
  setSelectedWidth,
  timeRange,
  setTimeRange,
  datesUserGraphics,
}: ChartDataProps) {
  const [chartStyle, setChartStyle] = useState<'purple' | 'colorful'>(
    localStorage.getItem('chartStyle') as 'purple' | 'colorful'
  )
  const [activeLines, setActiveLines] = useState({
    emotionalDiary: true,
    lvlenergy: true,
    lvlanxiety: true,
  })

  const activeChartConfig =
    chartStyle === 'purple'
      ? {
          emotionalDiary: { ...chartConfig.emotionalDiary, color: '#a78bfa' },
          lvlenergy: { ...chartConfig.lvlenergy, color: '#9333ea' },
          lvlanxiety: { ...chartConfig.lvlanxiety, color: '#6b21a8' },
        }
      : chartConfig

  // Filtro de front-end puro
  const filteredData = datesUserGraphics
    .filter((item) => {
      const itemDate = item.createdAt.split('T')[0]
      const now = new Date()
      let daysToSubtract = 7
      setSelectedWidth(1000)
      if (timeRange === '30d') {
        setSelectedWidth(1000)
        daysToSubtract = 30
      } else if (timeRange === '90d') {
        setSelectedWidth(1000)
        daysToSubtract = 90
      } else if (timeRange === '183d') {
        setSelectedWidth(2500)
        daysToSubtract = 183
      } else if (timeRange === '1y') {
        setSelectedWidth(98)
        daysToSubtract = 365
      }
      const startDate = new Date()
      startDate.setDate(now.getDate() - daysToSubtract)
      const startDateStr = startDate.toISOString().split('T')[0]
      return itemDate >= startDateStr
    })
    .map((item) => ({
      date: item.createdAt.split('T')[0],
      emotionalDiary: item.emotionalDiary,
      lvlenergy: item.lvlenergy,
      lvlanxiety: item.lvlanxiety,
    }))

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="hidden"></CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </div>
        <ConfigGraphics chartStyle={chartStyle} setChartStyle={setChartStyle} />
        <Metrics
          activeLines={activeLines}
          setActiveLines={setActiveLines}
          chartConfig={activeChartConfig}
        />
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 7 dias" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="183d">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">1 ano</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEmotional" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={activeChartConfig.emotionalDiary.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={activeChartConfig.emotionalDiary.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={activeChartConfig.lvlenergy.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={activeChartConfig.lvlenergy.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillAnxiety" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={activeChartConfig.lvlanxiety.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={activeChartConfig.lvlanxiety.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [year, month, day] = value.split('-')
                const date = new Date(
                  Number(year),
                  Number(month) - 1,
                  Number(day)
                )
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis domain={[0, 10]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [year, month, day] = value.split('-')
                    const date = new Date(
                      Number(year),
                      Number(month) - 1,
                      Number(day)
                    )
                    return date.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="emotionalDiary"
              type="natural"
              fill="url(#fillEmotional)"
              stroke={activeChartConfig.emotionalDiary.color}
              strokeWidth={2}
              stackId="a"
              hide={!activeLines.emotionalDiary}
            />
            <Area
              dataKey="lvlenergy"
              type="natural"
              fill="url(#fillEnergy)"
              stroke={activeChartConfig.lvlenergy.color}
              strokeWidth={2}
              stackId="b"
              hide={!activeLines.lvlenergy}
            />
            <Area
              dataKey="lvlanxiety"
              type="natural"
              fill="url(#fillAnxiety)"
              stroke={activeChartConfig.lvlanxiety.color}
              strokeWidth={2}
              stackId="c"
              hide={!activeLines.lvlanxiety}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
