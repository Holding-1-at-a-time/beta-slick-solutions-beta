"use server"

import { auth } from "@clerk/nextjs/server"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const logger = createLogger("SentimentTool")

/**
 * Analyzes the sentiment of text content
 */
export async function analyzeSentiment(text: string, options: { detailed?: boolean } = {}) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("analyzeSentiment", { textLength: text.length, options })

  return withErrorHandling(
    async () => {
      const prompt = options.detailed
        ? `Analyze the sentiment of the following text. Provide a detailed analysis including:
           1. Overall sentiment (positive, negative, neutral)
           2. Sentiment score (-1 to 1)
           3. Key emotional themes
           4. Specific positive and negative aspects mentioned
           5. Suggestions for response based on sentiment
           
           Text: "${text}"`
        : `Analyze the sentiment of the following text. Return a JSON object with:
           - sentiment: "positive", "negative", or "neutral"
           - score: a number from -1 (very negative) to 1 (very positive)
           - summary: a brief one-sentence summary of the sentiment
           
           Text: "${text}"`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a sentiment analysis specialist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      })

      const result = JSON.parse(response.choices[0].message.content || "{}")
      await logger.logOperationEnd(operationId, "analyzeSentiment", true, { result })
      return result
    },
    {
      source: "SentimentTool",
      code: "SENTIMENT_ANALYSIS_ERROR",
      severity: "medium",
      context: { textLength: text.length, options },
    },
  )
}
