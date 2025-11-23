import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

export const getProductRecommendation = async (
  userMessage: string, 
  products: Product[],
  systemInstruction: string,
  customApiKey?: string
): Promise<string> => {
  
  // Use custom key from settings if available, otherwise fallback to env var
  const apiKey = customApiKey || process.env.API_KEY || '';
  
  if (!apiKey) {
    return "I'm sorry, I haven't been configured with an API Key yet. Please check the Admin Dashboard settings.";
  }

  const ai = new GoogleGenAI({ apiKey });

  // Dynamically build the inventory string based on current products
  const inventoryContext = `
Here is the available product inventory (JSON format):
${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, category: p.category, description: p.description })))}
`;

  const finalInstruction = `${systemInstruction}\n\n${inventoryContext}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: finalInstruction,
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });

    return response.text || "I'm not sure how to answer that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please check your API Key configuration.";
  }
};
