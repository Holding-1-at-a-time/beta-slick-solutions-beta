import { callVisionAPI } from "@/app/actions/perception"
import { fetchGoogleCalendar } from "@/app/actions/scheduler"
import { vectorSearch } from "@/app/actions/vector-search"
import { sendEmail } from "@/app/actions/email"
import { dynamicPricingAgent } from "@/app/actions/pricing"
import { insightsTool } from "@/app/actions/insights"
import { recommendationTool } from "@/app/actions/recommend"
import { supervisorAgent } from "@/app/actions/supervisor"
import { trainRLAgent, addExperience } from "@/app/actions/rl-training"
import { analyzeSentiment } from "@/app/actions/sentiment"
import { extractDocumentData, generateDocument } from "@/app/actions/document-processing"
import { translateText, detectLanguage } from "@/app/actions/translation"
import { generateForecast, analyzeTimeSeries } from "@/app/actions/forecasting"
import { withRetry, createRetryable } from "@/lib/retry"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"

// Tools Registry
export const ToolsRegistry = {
  // Vision tools
  VisionTool: {
    callVisionAPI,
  },

  // Calendar tools
  CalendarTool: {
    fetchGoogleCalendar,
  },

  // Vector search tools
  VectorSearchTool: {
    vectorSearch,
  },

  // Email tools
  EmailTool: {
    sendEmail,
  },

  // Agent tools
  AgentTools: {
    dynamicPricingAgent,
    insightsTool,
    recommendationTool,
    supervisorAgent,
  },

  // RL/HER tools
  RLTools: {
    trainRLAgent,
    addExperience,
  },

  // Sentiment analysis tools
  SentimentTool: {
    analyzeSentiment,
  },

  // Document processing tools
  DocumentTool: {
    extractDocumentData,
    generateDocument,
  },

  // Translation tools
  TranslationTool: {
    translateText,
    detectLanguage,
  },

  // Forecasting tools
  ForecastingTool: {
    generateForecast,
    analyzeTimeSeries,
  },

  // Utility tools
  UtilityTools: {
    withRetry,
    createRetryable,
    withErrorHandling,
    createLogger,
  },
}

// Create retryable versions of common tools
export const RetryableTools = {
  callVisionAPI: createRetryable(callVisionAPI, {
    maxRetries: 3,
    retryableErrors: ["timeout", "network error", "rate limit"],
  }),

  vectorSearch: createRetryable(vectorSearch, {
    maxRetries: 3,
    retryableErrors: ["timeout", "network error"],
  }),

  sendEmail: createRetryable(sendEmail, {
    maxRetries: 5,
    retryableErrors: ["timeout", "network error", "temporary failure"],
  }),
}

export default ToolsRegistry
