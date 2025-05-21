"use client"

import type { ReactNode } from "react"
import { RevenueChart, type RevenueChartProps } from "./revenue-chart"
import { ServiceChart, type ServiceChartProps } from "./service-chart"
import { CustomerChart, type CustomerChartProps } from "./customer-chart"
import { AppointmentChart, type AppointmentChartProps } from "./appointment-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export type ChartType = "revenue" | "service" | "customer" | "appointment" | "custom"

type ChartProps =
  | ({ type: "revenue" } & RevenueChartProps)
  | ({ type: "service" } & ServiceChartProps)
  | ({ type: "customer" } & CustomerChartProps)
  | ({ type: "appointment" } & AppointmentChartProps)
  | {
      type: "custom"
      title?: string
      isLoading?: boolean
      renderChart: () => ReactNode
    }

interface ChartFactoryProps {
  chartProps: ChartProps
  wrapper?: (children: ReactNode) => ReactNode
}

export function ChartFactory({ chartProps, wrapper }: ChartFactoryProps) {
  let chartComponent: ReactNode

  if (chartProps.type === "custom") {
    if (chartProps.isLoading) {
      chartComponent = (
        <Card>
          <CardHeader>
            <CardTitle>{chartProps.title || "Chart"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      )
    } else {
      chartComponent = chartProps.renderChart()
    }
  } else {
    switch (chartProps.type) {
      case "revenue":
        chartComponent = <RevenueChart {...chartProps} />
        break
      case "service":
        chartComponent = <ServiceChart {...chartProps} />
        break
      case "customer":
        chartComponent = <CustomerChart {...chartProps} />
        break
      case "appointment":
        chartComponent = <AppointmentChart {...chartProps} />
        break
    }
  }

  if (wrapper) {
    return wrapper(chartComponent)
  }

  return chartComponent
}
