import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback key if not provided (non-crashing)
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json({
        content: "Clinical safety analysis mode is pending API Key initialization. Please add your GEMINI_API_KEY to the dashboard configuration to activate real-time intelligence warnings.",
        success: false,
      });
    }

    const { diagnosis, prescriptions, healthLogs, mode } = await req.json();

    let prompt = "";
    if (mode === "doctor") {
      prompt = `You are a professional Medical Expert AI serving as a safety validator for a Nigerian medical facility.
Evaluate the following clinical input:
- Treatment/Diagnosis: ${diagnosis || "None logged yet"}
- Active Prescriptions: ${JSON.stringify(prescriptions || [])}
- Patient Recent Biometrics (Weight and Heart Rate): ${JSON.stringify(healthLogs || [])}

Tasks:
1. Provide a highly precise clinical warning, drug interaction safety alert, or safety disclaimer.
2. Ensure the feedback is short, structured, professional, and references recognized healthcare standards (like World Health Organization - WHO, or Nigerian Federal Ministry of Health guidelines).
3. Do not formulate diagnostic certainties. Add a mandatory disclaimer that this is a companion guide and physicians retain absolute clinical authority.

Return the response in elegant, professional markdown syntax. Include no preamble or chatter.`;
    } else {
      prompt = `You are a warm, highly expert Patient Care Coordinator for a digital health portal in Nigeria.
The patient is viewing their portal. Translate these medical records into patient-friendly, empowering insights:
- Prescribed Treatments: ${diagnosis || "Regular routine monitoring"}
- Active Prescribed Drugs: ${JSON.stringify(prescriptions || [])}
- Historical Weight & Heart Rate Logs: ${JSON.stringify(healthLogs || [])}

Tasks:
1. Explain the prescribed drug schedule or treatment simply, highlighting side-effects (e.g., drowsiness, taking with meals) in clear, reassuring terms.
2. Give a brief, personalized gamified wellness target for weight/pulse management (e.g., target resting heart rate of 60-100 bpm is optimal, encouraging hydration, regular activity).
3. Frame suggestions around high-quality local Nigerian terms (e.g., balanced local Nigerian organic nutrition like beans, Unpolished Rice (Ofada), leafy greens (Ugu)).
4. Keep the text extremely encouraging, clear, and structured in Markdown. Add a notice to always consult their prescribing doctor.

Return the response in elegant, encouraging markdown syntax. Include no preamble or chatter.`;
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      content: response.text || "No response received from clinical model.",
      success: true,
    });
  } catch (error) {
    console.error("Clinical Analysis Server Error:", error);
    return NextResponse.json(
      {
        content: "Unable to process clinical security parameters at this time due to system timeout.",
        success: false,
      },
      { status: 500 }
    );
  }
}
