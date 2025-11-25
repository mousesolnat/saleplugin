
import { GoogleGenAI } from "@google/genai";
import { Product, StoreSettings } from '../types';

export const getProductRecommendation = async (
  userMessage: string,
  products: Product[],
  storeSettings: StoreSettings
): Promise<string> => {
  // Use API Key from settings, fallback to environment variable
  const apiKey = storeSettings.aiApiKey || process.env.API_KEY;

  if (!apiKey) {
    return "I'm sorry, the AI Assistant has not been configured with an API Key. Please set one in the Admin Dashboard under Settings > AI Assistant.";
  }

  // Initialize client with the correct key
  const ai = new GoogleGenAI({ apiKey });

  const storeName = storeSettings?.storeName || 'DigiMarket Pro';
  const inventory = JSON.stringify(products.map(p => ({ name: p.name, price: p.price, category: p.category })));

  // Use system instruction from settings, with a fallback
  const systemInstruction = storeSettings.aiSystemInstruction || `
You are a knowledgeable and helpful digital sales assistant for '${storeName}'.
Your goal is to help customers find the right WordPress plugins and tools from our specific inventory.
Here is the available product inventory (JSON format):
${inventory}

Rules:
1. ONLY recommend products that are in the inventory list above.
2. If a user asks for a product we don't have, suggest a similar alternative from our inventory if one exists, otherwise politely say we don't carry it.
3. Keep responses concise, friendly, and focused on sales.
4. Mention the price when recommending a product.
5. If the user asks general WordPress questions, you can answer them but try to tie it back to a product we sell (e.g., "How do I speed up my site?" -> "You can use caching. We sell Perfmatters...").
6. Do not invent products.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });

    return response.text || "I'm not sure how to answer that right now.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes('API key not valid')) {
       return "The configured Gemini API key is not valid. Please check it in the Admin Dashboard.";
    }
    return "I'm having trouble connecting to the AI server. Please try again later.";
  }
};
