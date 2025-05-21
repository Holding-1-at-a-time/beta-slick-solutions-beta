"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils/format-currency"

interface AIInsightsAgentProps {
  statistics: {
    invoiceAmount: number
    averageAmount: number
    percentageDifference: number
    userAverageAmount: number
    userPercentageDifference: number
    invoiceCount: number
    userInvoiceCount: number
  }
}

export function AIInsightsAgent({ statistics }: AIInsightsAgentProps) {
  const [insight, setInsight] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    if (!statistics) return

    // Simulate AI generation with a typing effect
    setIsGenerating(true)

    const generateInsight = () => {
      const { percentageDifference, userPercentageDifference, invoiceAmount, averageAmount } = statistics

      let insightText = ""

      if (percentageDifference > 10) {
        insightText = `This invoice is ${percentageDifference.toFixed(1)}% higher than the average invoice amount of ${formatCurrency(averageAmount)}. `
      } else if (percentageDifference < -10) {
        insightText = `This invoice is ${Math.abs(percentageDifference).toFixed(1)}% lower than the average invoice amount of ${formatCurrency(averageAmount)}. `
      } else {
        insightText = `This invoice is close to the average invoice amount of ${formatCurrency(averageAmount)}. `
      }

      if (userPercentageDifference > 10) {
        insightText += `It's also ${userPercentageDifference.toFixed(1)}% higher than your personal average. `
      } else if (userPercentageDifference < -10) {
        insightText += `It's also ${Math.abs(userPercentageDifference).toFixed(1)}% lower than your personal average. `
      } else {
        insightText += `It's in line with your personal average spending. `
      }

      if (percentageDifference > 0 && userPercentageDifference > 0) {
        insightText += `Consider discussing with your service provider if there were additional services provided that increased the cost.`
      } else if (percentageDifference < 0 && userPercentageDifference < 0) {
        insightText += `You received good value compared to both the market average and your typical spending.`
      }

      return insightText
    }

    const fullInsight = generateInsight()
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex <= fullInsight.length) {
        setInsight(fullInsight.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [statistics])

  if (!statistics) {
    return <p className="text-gray-500">No data available for insights.</p>
  }

  return (
    <div className="relative">
      <p className="text-sm leading-relaxed">
        {insight}
        {isGenerating && <span className="animate-pulse">|</span>}
      </p>
      {isGenerating && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress"></div>
        </div>
      )}
    </div>
  )
}
