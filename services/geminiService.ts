
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MachineData, MaintenancePrediction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This error will be thrown at build time or runtime if API_KEY is not set.
  // The app should handle this gracefully in the UI if possible,
  // but for this exercise, we assume API_KEY is available.
  console.error("API_KEY environment variable is not set.");
  // throw new Error("API_KEY environment variable is not set."); 
  // Throwing here might break the app initialization if not caught.
  // It's better to show an error in the UI when an API call is attempted.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a dummy if undefined to avoid constructor error
const model = "gemini-2.5-flash-preview-04-17";

const parseGeminiJsonResponse = <T,>(responseText: string): T | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; // Matches ```json ... ``` or ``` ... ```
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim(); // Extract content within fences
  }
  
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e);
    console.error("Raw Gemini response text:", responseText);
    return null; // Or throw new Error("Invalid JSON response from AI.")
  }
};


export const analyzeMachineDataWithGemini = async (machine: MachineData): Promise<MaintenancePrediction | null> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }

  const prompt = `
You are a predictive maintenance assistant for industrial equipment.
Analyze the following data for a single machine and determine if maintenance is required.

Machine Data:
Machine ID: ${machine.machineId}
Temperature (°C): ${machine.temperature}
Vibration Level: ${machine.vibrationLevel}
Pressure (bar): ${machine.pressure}
Operating Hours: ${machine.operatingHours}
Last Maintenance (days ago): ${machine.lastMaintenanceDays}
Error Logs: "${machine.errorLogs}"

Guidelines for analysis:
- If temperature is unusually high (> 90°C), consider it a risk factor for overheating.
- If vibration level is "High", flag it as a potential mechanical wear issue.
- If pressure is outside typical ranges (e.g., < 3 bar or > 5 bar), mention pressure anomalies.
- If operating hours exceed 1000 AND last maintenance was more than 60 days ago, consider that excessive usage.
- If error logs contain any warning (e.g., text other than "None" or an empty string, or specific keywords like "warning", "error", "detected", "failed"), include it in the reason.

Respond ONLY with a JSON object in the following strict format. Do not add any explanatory text before or after the JSON object itself:
{
  "Maintenance Required": "Yes" or "No",
  "Reason": "<Brief technical explanation using the input values. Be specific about which conditions triggered the assessment. Example: 'Temperature at 96°C exceeds threshold of 90°C. High vibration detected.'>",
  "Suggested Action": "<What the user or maintenance team should do. Be specific and actionable. Example: 'Inspect cooling system and fan. Check motor bearings and alignment.'>",
  "Urgency Level": "Low", "Medium", or "High"
}

Focus only on the provided machine data. Be concise and technical.
Ensure the "Reason" clearly states the specific values from the input that led to the conclusion.
If multiple factors contribute, list them. If no issues, state that clearly (e.g., "All parameters within normal operating ranges.").
The "Urgency Level" should correspond to the severity of the issues. High for critical issues, Medium for warnings, Low for minor or preventative checks.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Request JSON output
        temperature: 0.2, // Lower temperature for more deterministic, factual output
      }
    });

    const responseText = response.text;
    if (!responseText) {
      console.error("Gemini API returned an empty response text.");
      return null;
    }
    
    const parsedJson = parseGeminiJsonResponse<MaintenancePrediction>(responseText);

    if (!parsedJson) {
      // The parseGeminiJsonResponse already logged the error
      throw new Error("Failed to parse the JSON response from the AI service. The response might not be in the expected format.");
    }

    // Validate the structure of the parsed JSON
    if (!parsedJson['Maintenance Required'] || !parsedJson.Reason || !parsedJson['Suggested Action'] || !parsedJson['Urgency Level']) {
      console.error("Parsed JSON is missing required fields:", parsedJson);
      throw new Error("The AI's response, while valid JSON, is missing one or more required fields (Maintenance Required, Reason, Suggested Action, Urgency Level).");
    }
    
    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
    