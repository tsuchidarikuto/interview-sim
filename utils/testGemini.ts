"use client";
export default async function testGemini() {
    try {
        const response = await fetch('/api/gemini-tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: 'こんにちは、これはテストです。' }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
            console.error('Audio playback failed:', error);
            throw new Error('Audio playback failed');
        });
        
        return true;
    } catch (error) {
        console.error('Error in testGemini:', error);
        throw error;
    }

}
