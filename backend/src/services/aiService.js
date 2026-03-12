import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization for both clients
let openai = null;
let gemini = null;

const getOpenAI = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

const getGemini = () => {
  if (!gemini) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return gemini;
};

/**
 * System prompt for movie identification
 * Optimized for handling various screenshot types (Instagram, web pages, chat messages, posters)
 */
const MOVIE_IDENTIFICATION_PROMPT = `You are an expert movie identification system. Your task is to analyze screenshots and extract movie information.

Input types you may receive:
- Movie posters (theatrical, streaming service artwork)
- Instagram posts (single or carousel, with captions, hashtags, filters)
- Web page screenshots (IMDb, Rotten Tomatoes, Letterboxd, Netflix browsing grids)
- Chat messages (text mentioning movies)
- Streaming app UIs (Netflix, Prime Video, HBO Max browsing interfaces)
- Physical media (DVD/Blu-ray covers photographed)

For each image:
1. Identify the PRIMARY movie being shown or mentioned
2. Extract the exact title and release year
3. Assess confidence based on clarity and ambiguity

Confidence levels:
- "high": Clear poster, unmistakable image, or explicit text mention with year
- "medium": Partially visible, filtered/stylized, or text mention without year
- "low": Very unclear, multiple movies visible, ambiguous text, or uncertain match

Return ONLY a JSON object in this exact format:
{
  "title": "Movie Title",
  "year": 2024,
  "confidence": "high",
  "source": "poster|instagram|webpage|chat|streaming|other"
}

If you cannot identify a movie:
{
  "title": null,
  "year": null,
  "confidence": "low",
  "source": "unknown"
}`;

/**
 * Analyze an image using OpenAI GPT-4o-mini
 * @param {string} base64Image - Base64 encoded image (without data URL prefix)
 * @returns {Promise<{title: string, year: number|null, confidence: string, source: string}>}
 */
export const analyzeWithOpenAI = async (base64Image) => {
  try {
    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: MOVIE_IDENTIFICATION_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      provider: 'openai',
      title: result.title,
      year: result.year,
      confidence: result.confidence,
      source: result.source || 'unknown',
    };
  } catch (error) {
    console.error('OpenAI Analysis Error:', error.message);
    throw new Error(`OpenAI failed: ${error.message}`);
  }
};

/**
 * Analyze an image using Google Gemini Pro Vision
 * Fallback for low-confidence OpenAI results or complex layouts
 * @param {string} base64Image - Base64 encoded image (without data URL prefix)
 * @returns {Promise<{title: string, year: number|null, confidence: string, source: string}>}
 */
export const analyzeWithGemini = async (base64Image) => {
  try {
    const client = getGemini();
    const model = client.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `${MOVIE_IDENTIFICATION_PROMPT}

Analyze this image and return the JSON response.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);

    return {
      provider: 'gemini',
      title: parsed.title,
      year: parsed.year,
      confidence: parsed.confidence,
      source: parsed.source || 'unknown',
    };
  } catch (error) {
    console.error('Gemini Analysis Error:', error.message);
    throw new Error(`Gemini failed: ${error.message}`);
  }
};

/**
 * Hybrid analysis strategy:
 * 1. Try OpenAI GPT-4o-mini first (cheap & fast)
 * 2. If confidence is not "high", retry with Gemini
 * 3. Return the best result with provider info
 * 
 * @param {string} base64Image - Base64 encoded image (without data URL prefix)
 * @returns {Promise<{title: string, year: number|null, confidence: string, source: string, provider: string, fallbackUsed: boolean}>}
 */
export const analyzeImage = async (base64Image) => {
  let openaiResult = null;
  let geminiResult = null;
  let fallbackUsed = false;

  // Step 1: Try OpenAI first (cheapest option)
  try {
    console.log('🔍 Trying OpenAI GPT-4o-mini...');
    openaiResult = await analyzeWithOpenAI(base64Image);
    console.log('OpenAI result:', openaiResult);

    // If OpenAI is confident, use it
    if (openaiResult.confidence === 'high') {
      return { ...openaiResult, fallbackUsed: false };
    }

    console.log('OpenAI confidence not high, will try Gemini as fallback...');
  } catch (error) {
    console.warn('OpenAI failed:', error.message);
    // Continue to Gemini fallback
  }

  // Step 2: Try Gemini as fallback (better at complex layouts)
  // Only if Gemini API key is available
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('🔍 Trying Google Gemini...');
      geminiResult = await analyzeWithGemini(base64Image);
      console.log('Gemini result:', geminiResult);
      fallbackUsed = true;

      // Use Gemini result if it's more confident
      if (geminiResult.confidence === 'high') {
        return { ...geminiResult, fallbackUsed: true };
      }

      // If Gemini is also not confident, compare and return best
      if (openaiResult) {
        // Prefer the one with higher confidence, or Gemini for medium confidence
        const confidenceOrder = { high: 3, medium: 2, low: 1 };
        const openaiScore = confidenceOrder[openaiResult.confidence] || 0;
        const geminiScore = confidenceOrder[geminiResult.confidence] || 0;

        if (geminiScore >= openaiScore) {
          return { ...geminiResult, fallbackUsed: true };
        }
      }

      // Return Gemini result even if not better (we tried)
      return { ...geminiResult, fallbackUsed: true };
    } catch (error) {
      console.warn('Gemini fallback failed:', error.message);
    }
  } else {
    console.log('Gemini API key not set, skipping fallback');
  }

  // Step 3: Return OpenAI result if we have it, even with low confidence
  if (openaiResult) {
    return { ...openaiResult, fallbackUsed: false };
  }

  // Step 4: Complete failure
  throw new Error('Both AI providers failed to analyze the image');
};

/**
 * Quick health check for AI services
 * @returns {Promise<{openai: boolean, gemini: boolean}>}
 */
export const checkAIServices = async () => {
  const status = { openai: false, gemini: false };

  // Check OpenAI
  try {
    const client = getOpenAI();
    // Simple models list call to verify connectivity
    await client.models.list();
    status.openai = true;
  } catch (error) {
    console.warn('OpenAI health check failed:', error.message);
  }

  // Check Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const client = getGemini();
      // Gemini doesn't have a simple ping, so we just check initialization
      status.gemini = true;
    } catch (error) {
      console.warn('Gemini health check failed:', error.message);
    }
  }

  return status;
};

export default {
  analyzeImage,
  analyzeWithOpenAI,
  analyzeWithGemini,
  checkAIServices,
};
