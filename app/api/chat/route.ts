import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { SYSTEM_PROMPT } from "@/config/constants";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: process.env.GROQ_API_BASE_URL || "https://api.groq.com/openai/v1",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  let { messages } = await req.json();

  if (!messages || messages.length === 0) {
    messages = [{ role: "system", content: SYSTEM_PROMPT }];
  }

  // Ask Groq for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "mixtral-8x7b-32768",
    stream: true,
    messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
