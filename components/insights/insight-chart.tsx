import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string | string[]
  }>
}

interface InsightChartProps {
  title: string
  data: ChartData
}

export function InsightChart({ title, data }: InsightChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {/* In a real implementation, this would use a chart library like Chart.js or Recharts */}
          <div className="flex h-full items-end justify-between gap-2 pb-4">
            {data.datasets[0].data.map((value, index) => {
              const maxValue = Math.max(...data.datasets[0].data)
              const height = (value / maxValue) * 100
              const bgColor = Array.isArray(data.datasets[0].backgroundColor)
                ? data.datasets[0].backgroundColor[index]
                : data.datasets[0].backgroundColor

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-12 rounded-t"
                    style={{
                      height: `${height}%`,
                      backgroundColor: bgColor,
                      minHeight: "4px",
                    }}
                  />
                  <span className="mt-2 text-xs">{data.labels[index]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
