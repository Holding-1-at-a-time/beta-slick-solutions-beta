import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SupervisorSummaryProps {
  text: string
}

export function SupervisorSummary({ text }: SupervisorSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  )
}
