'use client';
import Link from 'next/link';
import { useEffect ,useState } from "react";
import {collection,getDocs,query} from 'firebase/firestore';
import {Container,Card,Stack} from '@mui/material';
import {firestore} from '@/firebase';
import {interviewResultTypes} from '@/types';
import { set } from 'zod';

export default function History(){
    const [history,setHistory] = useState<interviewResultTypes[]>([]);

    async function getHistory(){
        try{
            const q = query(collection(firestore,'history'));
            const snapShot = await getDocs(q);
            const interviewResultHistory = snapShot.docs.map(doc=>{
                const data = doc.data();
                const convertedData:interviewResultTypes = {
                    isPass:data.isPass,
                    feedback:{
                        positive:data.positiveFeedback,
                        negative:data.negativeFeedback
                    },
                    score:{
                        technical:data.technicalScore,
                        communication:data.communicationScore,
                        teamwork:data.teamworkScore,
                        logicalThinking:data.logicalThinkingScore,
                        learningDesire:data.learningDesireScore,
                        companyUnderstanding:data.companyUnderstandingScore
                    }
                }
                return convertedData;
            }); 
            console.log(interviewResultHistory);
            setHistory(interviewResultHistory);
            console.log(history)
        }catch(e){
            console.error('Error getting document:',e);
        }
    };
    
    useEffect(()=>{
        getHistory();
    },[]);

    return(
        <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '80vh' }}>
            <Stack spacing={5}>
                <Card sx={{ p: 2 }} variant="outlined">
                    <h1>History</h1>
                </Card>
                {history.map((item,index)=>(
                    <Card key={index} sx={{ p: 2 }} variant="outlined">                        
                        <p>isPass:{item.isPass}</p>
                        <p>positiveFeedback:{item.feedback.positive}</p>
                        <p>negativeFeedback:{item.feedback.negative}</p>
                        <p>technicalScore:{item.score.technical}</p>
                        <p>communicationScore:{item.score.communication}</p>
                        <p>teamworkScore:{item.score.teamwork}</p>
                        <p>logicalThinkingScore:{item.score.logicalThinking}</p>
                        <p>learningDesireScore:{item.score.learningDesire}</p>
                        <p>companyUnderstandingScore:{item.score.companyUnderstanding}</p>
                    </Card>
                ))}
            </Stack>
        </Container>

    )

}