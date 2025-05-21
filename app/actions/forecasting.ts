"use server"

import { auth } from "@clerk/nextjs/server"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const logger = createLogger("ForecastingTool")

/**
 * Generates time series forecasts based on historical data
 */
export async function generateForecast(
  historicalData: Array<{ timestamp: number; value: number }>,
  options: {
    forecastPeriods: number
    periodType: "day" | "week" | "month"
    includeSeasonality?: boolean
    confidenceInterval?: boolean
  },
) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("generateForecast", {
    dataPoints: historicalData.length,
    options,
  })

  return withErrorHandling(
    async () => {
      // In a real implementation, this would use a proper time series forecasting model
      // For now, we'll use a simple AI-based approach
      const prompt = `Generate a time series forecast based on this historical data:
        
        ${JSON.stringify(historicalData)}
        
        Forecast parameters:
        - Number of periods to forecast: ${options.forecastPeriods}
        - Period type: ${options.periodType}
        - Include seasonality analysis: ${options.includeSeasonality ? "Yes" : "No"}
        - Include confidence intervals: ${options.confidenceInterval ? "Yes" : "No"}
        
        Return a JSON object with:
        1. "forecast": array of predicted values with timestamps
        2. "trend": overall trend direction and magnitude
        3. "seasonality": seasonal patterns (if requested)
        4. "confidenceIntervals": upper and lower bounds (if requested)
        5. "anomalies": any anomalies detected in historical data`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a time series forecasting specialist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      })

      const result = JSON.parse(response.choices[0].message.content || "{}")
      await logger.logOperationEnd(operationId, "generateForecast", true, { result })
      return result
    },
    {
      source: "ForecastingTool",
      code: "FORECAST_GENERATION_ERROR",
      severity: "medium",
      context: { dataPoints: historicalData.length, options },
    },
  )
}

/**
 * Analyzes patterns and anomalies in time series data
 */
export async function analyzeTimeSeries(data: Array<{ timestamp: number; value: number }>) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("analyzeTimeSeries", { dataPoints: data.length })

  return withErrorHandling(
    async () => {
      const prompt = `Analyze this time series data and provide insights:
        
        ${JSON.stringify(data)}
        
        Return a JSON object with:
        1. "trend": overall trend analysis
        2. "seasonality": any seasonal patterns detected
        3. "anomalies": any anomalous data points with explanations
        4. "correlations": potential correlations with external factors
        5. "recommendations": suggested actions based on the analysis`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a data analysis specialist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      })

      const result = JSON.parse(response.choices[0].message.content || "{}")
      await logger.logOperationEnd(operationId, "analyzeTimeSeries", true, { result })
      return result
    },
    {
      source: "ForecastingTool",
      code: "TIME_SERIES_ANALYSIS_ERROR",
      severity: "medium",
      context: { dataPoints: data.length },
    },
  )
}
