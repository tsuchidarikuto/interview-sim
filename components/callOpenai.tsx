import OpenaAi, { OpenAI } from 'openai';

export default async function CallOpenai() {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const gptResponse = await client.chat.completions.create({
        messages:[
            { role:'system',content:'this is a test'},
            { role:'user',content:'test'}
        ],
        model: 'gpt-3.5-turbo',
    });
    

    return JSON.stringify(gptResponse.choices[0].message);

}