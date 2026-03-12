# AI Services Documentation

## Overview

Rodeo Movies uses a **hybrid AI strategy** combining OpenAI GPT-4o-mini and Google Gemini Pro Vision to handle diverse screenshot types with optimal cost and accuracy.

## Hybrid Strategy

```
User Upload
    │
    ▼
┌─────────────────────┐
│  OpenAI GPT-4o-mini │ ◄── Primary (cheap, fast, 80% of cases)
│     ~$0.0006/img    │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │ Confidence? │
    └──────┬──────┘
           │
     ┌─────┴─────┐
  High│         │Low/Medium
     │           │
     ▼           ▼
 Return      ┌─────────────────┐
 Result      │ Google Gemini   │ ◄── Fallback (complex layouts)
             │  ~$0.001875/img │
             └────────┬────────┘
                      │
                      ▼
                 Return Result
```

## Providers

### OpenAI GPT-4o-mini (Primary)
- **Model**: `gpt-4o-mini`
- **Cost**: ~$0.0006 per image
- **Strengths**: 
  - Cheapest option
  - Consistent JSON output
  - Excellent for clear movie posters
  - Fast response times
- **Weaknesses**:
  - Struggles with cluttered layouts
  - May miss text in Instagram posts with heavy filters
  - Multiple movies in one image can confuse it

### Google Gemini Pro Vision (Fallback)
- **Model**: `gemini-2.0-flash-exp`
- **Cost**: ~$0.001875 per image (~3x more expensive)
- **Strengths**:
  - Better at reading small text
  - Handles cluttered web page screenshots
  - Better with Instagram multi-image layouts
  - More robust to image quality issues
- **Weaknesses**:
  - More expensive
  - Slightly slower
  - JSON output can be less consistent

## Supported Screenshot Types

| Type | OpenAI | Gemini | Notes |
|------|--------|--------|-------|
| Movie Posters | ⭐⭐⭐ | ⭐⭐⭐ | Both excellent |
| Instagram Posts | ⭐⭐ | ⭐⭐⭐ | Gemini better with filters/layouts |
| Instagram Carousels | ⭐ | ⭐⭐⭐ | Gemini handles multi-image better |
| Webpage Screenshots | ⭐⭐ | ⭐⭐⭐ | Gemini better at small text |
| IMDb Pages | ⭐⭐⭐ | ⭐⭐⭐ | Both good if poster visible |
| Netflix/Streaming UI | ⭐⭐ | ⭐⭐⭐ | Gemini better with grids |
| Chat Messages | ⭐⭐ | ⭐⭐⭐ | Gemini better with text |
| Physical Media Photos | ⭐⭐⭐ | ⭐⭐⭐ | Both good with clear lighting |

## Prompt Engineering

### Core System Prompt

Both providers use the same base prompt for consistency:

```
You are an expert movie identification system. Your task is to analyze 
screenshots and extract movie information.

Input types you may receive:
- Movie posters (theatrical, streaming service artwork)
- Instagram posts (single or carousel, with captions, hashtags, filters)
- Web page screenshots (IMDb, Rotten Tomatoes, Letterboxd, Netflix)
- Chat messages (text mentioning movies)
- Streaming app UIs (Netflix, Prime Video, HBO Max)
- Physical media (DVD/Blu-ray covers photographed)

For each image:
1. Identify the PRIMARY movie being shown or mentioned
2. Extract the exact title and release year
3. Assess confidence based on clarity and ambiguity

Confidence levels:
- "high": Clear poster, unmistakable image, or explicit text mention with year
- "medium": Partially visible, filtered/stylized, or text mention without year  
- "low": Very unclear, multiple movies visible, ambiguous text, or uncertain match

Return ONLY a JSON object:
{
  "title": "Movie Title",
  "year": 2024,
  "confidence": "high",
  "source": "poster|instagram|webpage|chat|streaming|other"
}
```

### Why This Prompt Works

1. **Explicit Input Types**: Lists all possible screenshot formats so AI knows what to expect
2. **Primary Focus**: Explicitly asks for "PRIMARY movie" to avoid confusion with background/secondary movies
3. **Confidence Calibration**: Clear rubric for confidence levels ensures consistent scoring
4. **Structured Output**: JSON format enables reliable parsing
5. **Source Tracking**: Helps debug which input types need improvement

## Cost Optimization

### Typical Usage Pattern

Assuming 100 screenshots per day:

| Strategy | OpenAI Cost | Gemini Cost | Total |
|----------|-------------|-------------|-------|
| OpenAI Only (all low conf) | $0.06 | $0 | $0.06/day |
| Gemini Only | $0 | $0.19 | $0.19/day |
| **Hybrid (our approach)** | ~$0.05 | ~$0.04 | **~$0.09/day** |

*Hybrid assumes 80% high confidence from OpenAI, 20% fallback to Gemini*

### Configuration Options

```javascript
// Option 1: OpenAI only (cheapest, less accurate on complex images)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=      // leave empty

// Option 2: Both providers (recommended)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...   // set both

// Option 3: Gemini only (not recommended - more expensive)
OPENAI_API_KEY=      // leave empty
GEMINI_API_KEY=...   // will error if no OpenAI key!
```

## API Response Format

### Successful Analysis

```json
{
  "title": "Dune: Part Two",
  "year": 2024,
  "confidence": "high",
  "source": "poster",
  "provider": "openai",
  "fallbackUsed": false
}
```

### Fallback Triggered

```json
{
  "title": "Poor Things",
  "year": 2023,
  "confidence": "high", 
  "source": "instagram",
  "provider": "gemini",
  "fallbackUsed": true
}
```

### Low Confidence (Both Failed)

```json
{
  "title": null,
  "year": null,
  "confidence": "low",
  "source": "unknown",
  "provider": "openai",
  "fallbackUsed": false
}
```

## Error Handling

### Provider Failures

| Scenario | Behavior |
|----------|----------|
| OpenAI fails, Gemini succeeds | Returns Gemini result with `fallbackUsed: true` |
| OpenAI low conf, Gemini high conf | Returns Gemini result with `fallbackUsed: true` |
| Both fail | Throws error: "Both AI providers failed" |
| No API keys set | Throws error on first analysis attempt |

### Health Check

Check AI service status:

```bash
curl http://localhost:3001/health/ai
```

Response:
```json
{
  "openai": true,
  "gemini": true
}
```

## Testing Different Image Types

### Test Images to Try

1. **Clear Movie Poster**: High confidence expected
2. **Netflix Browse Grid**: May trigger Gemini fallback
3. **Instagram Story with Text**: Likely Gemini fallback
4. **Chat Screenshot**: Likely Gemini fallback  
5. **Physical DVD Cover**: High confidence expected
6. **Blurry/Partial Image**: Low confidence expected

### Debug Logging

Enable debug mode in `.env`:
```
DEBUG_AI=true
```

This logs:
- Which provider was used
- Confidence scores
- Fallback decisions
- Response times

## Future Improvements

1. **Fine-tuned Models**: Train custom model on movie-specific dataset
2. **Multi-movie Detection**: Support for "identify all movies in this collage"
3. **OCR Integration**: Pre-process with OCR for text-heavy images
4. **Caching**: Cache results for identical images
5. **User Feedback Loop**: Learn from corrections to improve prompts

## References

- [OpenAI Vision Guide](https://platform.openai.com/docs/guides/vision)
- [Gemini Pro Vision](https://ai.google.dev/gemini-api/docs/vision)
- [TMDB API Documentation](https://developer.themoviedb.org/docs/getting-started)
