import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getNearbyFacilities(location: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find 5 top-rated medical facilities in or near ${location}. Provide their names, types (Hospital, Clinic, Specialized Center), a brief description of their key services, and an address. Format the response as JSON.`,
    config: {
      tools: [{ googleMaps: {} }],
      // Note: responseMimeType is not allowed with googleMaps tool per guidelines
    },
  });

  return response;
}

export async function askHealthAssistant(query: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: "You are a helpful and professional medical assistant for MediCenter. Provide clear, concise, and empathetic information about medical services and general health advice. Always include a disclaimer that you are an AI and the user should consult a real doctor for medical emergencies or specific diagnoses.",
    },
  });
  return response.text;
}
