import CallOpenai from "./callOpenai";

export async function PreparationInterview(){    
    const interviewSheet=await CallOpenai();
    console.log(interviewSheet);
}