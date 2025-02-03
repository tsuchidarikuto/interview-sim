'use client';

export default async function CallOpenai(model: string,system:string,prompt: string,schemaName:string) {
    try {
        
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                system:system,
                prompt: prompt,
                schemaName:schemaName
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Network response was not ok');
        }
        const data = await response.json(); //レスポンスを
        if (!data) {
            return 'No data';
        }
        
        return data.choices[0].message.content;
    } catch (e) {
        console.log(e);
        return `Error: ${e}`;
    }
}