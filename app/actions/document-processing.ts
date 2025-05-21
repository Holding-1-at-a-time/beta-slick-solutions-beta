"use server"

import { auth } from "@clerk/nextjs/server"
import { withErrorHandling } from "@/lib/error-handling"
import { createLogger } from "@/lib/logging"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const logger = createLogger("DocumentTool")

/**
 * Extracts structured data from document text
 */
export async function extractDocumentData(text: string, schema: Record<string, string>) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("extractDocumentData", { textLength: text.length, schema })

  return withErrorHandling(
    async () => {
      const schemaDescription = Object.entries(schema)
        .map(([key, description]) => `- ${key}: ${description}`)
        .join("\n")

      const prompt = `Extract the following information from this document text:
        
        ${schemaDescription}
        
        Return the data as a JSON object with these fields.
        If a field is not found in the text, set its value to null.
        
        Document text:
        "${text}"`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a document processing specialist." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      })

      const result = JSON.parse(response.choices[0].message.content || "{}")
      await logger.logOperationEnd(operationId, "extractDocumentData", true, { result })
      return result
    },
    {
      source: "DocumentTool",
      code: "DOCUMENT_EXTRACTION_ERROR",
      severity: "medium",
      context: { textLength: text.length, schemaKeys: Object.keys(schema) },
    },
  )
}

/**
 * Generates a document from structured data
 */
export async function generateDocument(
  template: string,
  data: Record<string, any>,
  options: { format?: "text" | "html" | "markdown" } = {},
) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  const operationId = await logger.logOperationStart("generateDocument", {
    templateLength: template.length,
    data,
    options,
  })

  return withErrorHandling(
    async () => {
      // Replace template variables with data
      let document = template
      for (const [key, value] of Object.entries(data)) {
        document = document.replace(new RegExp(`{{${key}}}`, "g"), String(value))
      }

      // If there are still template variables, use AI to fill them
      if (document.includes("{{") && document.includes("}}")) {
        const prompt = `Complete this document template by filling in any remaining template variables.
          Use the provided data and make reasonable inferences for any missing values.
          
          Template:
          "${document}"
          
          Data:
          ${JSON.stringify(data, null, 2)}
          
          Return the completed document in ${options.format || "text"} format.`

        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a document generation specialist." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        })

        document = response.choices[0].message.content || document
      }

      await logger.logOperationEnd(operationId, "generateDocument", true, { documentLength: document.length })
      return document
    },
    {
      source: "DocumentTool",
      code: "DOCUMENT_GENERATION_ERROR",
      severity: "medium",
      context: { templateLength: template.length, dataKeys: Object.keys(data), options },
    },
  )
}
