"use server"

import OpenAI from "openai"
import { auth } from "@clerk/nextjs/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createChatCompletion(prompt: string, options: { signal?: AbortSignal } = {}) {
  const { orgId } = auth()
  if (!orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant for a vehicle service platform." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    return JSON.parse(response.choices[0].message.content || "{}")
  } catch (error) {
    console.error("Error in createChatCompletion:", error)
    throw new Error("Failed to generate completion")
  }
}
