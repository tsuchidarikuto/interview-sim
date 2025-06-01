import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import wav from 'wav';

function createWavBuffer(pcmData: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({
            channels: 1,
            sampleRate: 24000,
            bitDepth: 16,
        });

        const chunks: Buffer[] = [];
        
        writer.on('data', (chunk) => chunks.push(chunk));
        writer.on('finish', () => resolve(Buffer.concat(chunks)));
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `次のテキストを読み上げなさい: ${text}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (data) {
            const audioBuffer = Buffer.from(data, 'base64');
            const wavBuffer = await createWavBuffer(audioBuffer);
            
            return new NextResponse(wavBuffer, {
                status: 200,
                headers: { 'Content-Type': 'audio/wav' },
            });
        } else {
            return NextResponse.json({ error: 'No audio data found' }, { status: 500 });
        }
        
    } catch (e) {
        console.error('Gemini TTS Error:', e);
        return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }
}