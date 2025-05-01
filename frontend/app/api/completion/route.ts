import { google } from "@ai-sdk/google";
import { streamText } from "ai";

type TReq = {
  prompt: string;
};

export async function POST(req: Request) {
  const reqObj: TReq = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    system: "You are a image analysis assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "What's in this lab report image? Analyze the lab results in the image provided. Summarize key findings, flag abnormal values, and suggest possible clinical interpretations. Prioritize urgent abnormalities. Think like a doctor.",
          },
          {
            type: "image",
            image: reqObj.prompt,
          },
        ],
      },
    ],
  });

  return result.toDataStreamResponse();
}
