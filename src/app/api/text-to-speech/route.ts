import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'adam' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const voiceIds: Record<string, string> = {
      adam: 'pNInz6obpgDQGcFmaJgB', // Deep male voice
      rachel: '21m00Tcm4TlvDq8ikWAM', // Female voice
      domi: 'AZnzlk1XvdvUeBnXmlld', // Strong female voice
    };

    const voiceId = voiceIds[voice] || voiceIds.adam;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${errorText}`);
    }

    const audioBlob = await response.blob();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
      voice,
    });

  } catch (error: any) {
    console.error('Error generating speech:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate speech',
      },
      { status: 500 }
    );
  }
}