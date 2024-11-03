import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { frames } = await request.json();

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json(
        { error: 'No frames provided' },
        { status: 400 }
      );
    }

    // Analyze first few frames to keep costs down
    const framesToAnalyze = frames.slice(0, 3);

    const content: any[] = [`I'm sharing ${framesToAnalyze.length} screenshots from a Hinge profile. Please analyze them and provide feedback on:
        1. First impression
        2. Photo quality and variety
        3. Profile text and prompts
        4. Specific suggestions for improvement`]

    content.push(...framesToAnalyze.map((frame) => ({
      type: "image_url",
      image_url: {
        url: frame,
      },
    })))
    
    const messages: any[] = [
      {
        role: "system",
        content: "You are an expert dating profile consultant. Analyze these Hinge profile screenshots and provide specific, actionable feedback to improve the profile."
      },
      {
        role: "user",
        content: content
      }
    ];



    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      max_tokens: 1000,
    });

    const feedback = completion.choices[0].message.content;

    return NextResponse.json({
      feedback,
      analyzedFrames: framesToAnalyze.length,
      totalFrames: frames.length
    });

  } catch (error) {
    console.error('Error processing review:', error);
    return NextResponse.json(
      { error: 'Failed to process review' },
      { status: 500 }
    );
  }
}
