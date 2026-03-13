'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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

// --- DATA FICTÍCIO (MOCK) ---
const generatedData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (364 - i))
  return {
    date: date.toISOString().split('T')[0],
    performance: Math.floor(Math.random() * 5) + 1,
  }
})

const chartConfig = {
  performance: {
    label: 'Desempenho',
    color: '#9333ea',
  },
} satisfies ChartConfig

export function ChartDailyInteractive() {
  const [timeRange, setTimeRange] = React.useState('7d')

  // Filtro de front-end puro
  const filteredData = generatedData.filter((item) => {
    const itemDate = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 7
    if (timeRange === '30d') daysToSubtract = 30
    else if (timeRange === '90d') daysToSubtract = 90
    else if (timeRange === '183d') daysToSubtract = 183
    else if (timeRange === '1y') daysToSubtract = 365

    const startDate = new Date()
    startDate.setDate(now.getDate() - daysToSubtract)
    return itemDate >= startDate
  })

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="hidden"></CardTitle>
          <CardDescription className="hidden"></CardDescription>
        </div>
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.performance.color}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.performance.color}
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
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
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
              dataKey="performance"
              type="natural"
              fill="url(#fillPerformance)"
              stroke={chartConfig.performance.color}
              strokeWidth={2}
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
