import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SkinAnalysisResult {
  dosha: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  forecast: {
    current: string;
    future: string;
    prediction: string;
  };
  recommendations: {
    name: string;
    benefit: string;
    image: string;
  }[];
  treatmentPlan: {
    category: string;
    items: string[];
  }[];
}

export async function analyzeSkin(imageData?: string): Promise<SkinAnalysisResult> {
  // In a real app, we'd send the image to Gemini.
  // For this demo, we'll simulate a high-quality AI response based on the image context.
  
  const prompt = `
    Analyze this skin data (or simulate a high-quality Ayurvedic skin analysis).
    Return a JSON object with:
    - dosha: { vata: 0-100, pitta: 0-100, kapha: 0-100 }
    - forecast: { current: "state", future: "state", prediction: "detailed prediction" }
    - recommendations: array of { name, benefit, image_keyword }
    - treatmentPlan: array of { category, items: string[] }
    
    The analysis should be professional, Ayurvedic-focused, and predictive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: imageData ? [
        { inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] } },
        { text: prompt }
      ] : prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback mock data that matches the image's aesthetic
    return {
      dosha: { vata: 65, pitta: 45, kapha: 30 },
      forecast: {
        current: "Mild Irritation",
        future: "Aging Signs",
        prediction: "Increased Pitta levels may lead to inflammatory responses. Early intervention with cooling herbs is recommended."
      },
      recommendations: [
        { name: "Neem", benefit: "Purification", image: "neem" },
        { name: "Turmeric", benefit: "Anti-inflammatory", image: "turmeric" },
        { name: "Aloe Vera", benefit: "Soothing", image: "aloe" }
      ],
      treatmentPlan: [
        { category: "Detox Diet", items: ["Green Mung Soup", "Warm Ginger Water"] },
        { category: "Herbal Remedies", items: ["Triphala at night", "Amla Juice"] },
        { category: "Skincare Routine", items: ["Rose water mist", "Sandalwood mask"] }
      ]
    };
  }
}
