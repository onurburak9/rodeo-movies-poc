import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze an image to extract movie information
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<{title: string, year: number|null, confidence: string}>}
 */
export const analyzeImage = async (base64Image) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a movie identification expert. Analyze the image and identify the movie.
If the image shows a movie poster, screenshot from a movie, or a streaming app interface showing a movie, extract the title and year.

Return ONLY a JSON object in this exact format:
{
  "title": "Movie Title",
  "year": 2024,
  "confidence": "high"
}

Confidence levels:
- "high": Clear movie poster or well-known screenshot
- "medium": Partial match or unclear image
- "low": Uncertain, might be wrong

If you cannot identify a movie, return:
{
  "title": null,
  "year": null,
  "confidence": "low"
}`,
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
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      title: result.title,
      year: result.year,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze image');
  }
};

export default { analyzeImage };
