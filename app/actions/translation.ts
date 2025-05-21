"use server"

import { auth } from "@clerk/nextjs/server"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const logger = createLogger("TranslationTool")

/**
 * Translates text to the target language
 */
export async function translateText(text: string, targetLanguage: string) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("translateText", { textLength: text.length, targetLanguage })

  return withErrorHandling(
    async () => {
      const prompt = `Translate the following text to ${targetLanguage}:
        
        "${text}"
        
        Provide only the translated text without any additional comments.`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a professional translator." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      })

      const translatedText = response.choices[0].message.content || ""
      await logger.logOperationEnd(operationId, "translateText", true, { translatedTextLength: translatedText.length })
      return translatedText
    },
    {
      source: "TranslationTool",
      code: "TRANSLATION_ERROR",
      severity: "medium",
      context: { textLength: text.length, targetLanguage },
    },
  )
}

/**
 * Detects the language of the provided text
 */
export async function detectLanguage(text: string) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("detectLanguage", { textLength: text.length })

  return withErrorHandling(
    async () => {
      const prompt = `Detect the language of the following text. Return a JSON object with:
        - languageCode: the ISO 639-1 code of the detected language
        - languageName: the full name of the language in English
        - confidence: a number from 0 to 1 indicating confidence level
        
        Text: "${text}"`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a language detection specialist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      })

      const result = JSON.parse(response.choices[0].message.content || "{}")
      await logger.logOperationEnd(operationId, "detectLanguage", true, { result })
      return result
    },
    {
      source: "TranslationTool",
      code: "LANGUAGE_DETECTION_ERROR",
      severity: "medium",
      context: { textLength: text.length },
    },
  )
}
