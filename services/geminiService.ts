import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

// Initialize the Gemini client
// Note: In a production app, never expose API keys in client-side code unless using a proxy or strict referral restrictions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const systemInstruction = `
You are a knowledgeable and helpful digital sales assistant for 'DigiMarket Pro'.
Your goal is to help customers find the right WordPress plugins and tools from our specific inventory.
Here is the available product inventory (JSON format):
${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, price: p.price, category: p.category })))}

Rules:
1. ONLY recommend products that are in the inventory list above.
2. If a user asks for a product we don't have, suggest a similar alternative from our inventory if one exists, otherwise politely say we don't carry it.
3. Keep responses concise, friendly, and focused on sales.
4. Mention the price when recommending a product.
5. If the user asks general WordPress questions, you can answer them but try to tie it back to a product we sell (e.g., "How do I speed up my site?" -> "You can use caching. We sell Perfmatters and WP Rocket...").
6. Do not invent products.
`;

export const getProductRecommendation = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "I'm sorry, my brain (API Key) is missing. Please check the app configuration.";
  }

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
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};