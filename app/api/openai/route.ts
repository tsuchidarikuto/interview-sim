import {NextResponse,NextRequest} from 'next/server';
import {OpenAI} from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import type {openaiTypes} from '@/types';
import {z} from 'zod';



export async function POST(req:NextRequest){
    const openai = new OpenAI({ apiKey:process.env.OPENAI_API_KEY});
    

    const {prompt,model,system,schemaName}=(await req.json()) as openaiTypes;//クライアントサイド  からのリクエストを受け取る
    
    let schema;
    console.log(`at route.ts:${schemaName}`);
    if(schemaName==="questions"){
        schema=z.object({
            questions:z.array(z.object({
                id:z.string(),
                question:z.string(),
            })),
        });
    }else if (schemaName==="undefined"){
        schema=undefined;
    }
    console.log(schema);
    
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
        response_format: schema ? zodResponseFormat(schema,'scheema') : undefined,
    });
    return NextResponse.json(response);//中間APIのレスポンスを返す
}catch(e){
    console.log(`Error in API end point: ${e}`);
}


}