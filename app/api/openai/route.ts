import {NextResponse,NextRequest} from 'next/server';
import {OpenAI} from 'openai';
import type {openaiTypes} from '@/types';

const openai = new OpenAI({ apiKey:process.env.OPENAI_API_KEY});

export async function POST(req:NextRequest){
    const {prompt,model,system}=(await req.json()) as openaiTypes;
    console.log(prompt,model);
    try{
    const response=await openai.chat.completions.create({
        model:model,
        messages:[
            {
                role:'system',
                content:system,
            },
            {
                role:'user',
                content:prompt,
            },
        ],   
    });
    return NextResponse.json(response);
}catch(e){
    console.log(`Error in API end point: ${e}`);
}


}