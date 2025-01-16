'use client';
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Card, Stack, Typography, Box,Button } from '@mui/material';
import { firestore } from '@/firebase';
import { interviewResultTypes } from '@/types';
import ResultChart from '@/components/resultChart';
import Grid from '@mui/material/Grid2';
import {AuthContext} from '@/provider/AuthContext';


export default function MailBox() {
    const [history, setHistory] = useState<interviewResultTypes[]>([]);
    const {user} = useContext(AuthContext);

    async function getHistory() {
        try {
            if (!user) {
                throw new Error('User is not found');
            }
            
            const q = query(
                collection(firestore, 'history'),
                where('uid','==',user.uid)
            );

            const snapShot = await getDocs(q);
            const interviewResultHistory = snapShot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;

                const convertedData: interviewResultTypes = {
                    id:id,
                    uid: data.uid,
                    isPass: data.isPass,
                    feedback: {
                        positive: data.positiveFeedback,
                        negative: data.negativeFeedback
                    },
                    score: {
                        technical: data.technicalScore,
                        communication: data.communicationScore,
                        teamwork: data.teamworkScore,
                        logicalThinking: data.logicalThinkingScore,
                        learningDesire: data.learningDesireScore,
                        companyUnderstanding: data.companyUnderstandingScore
                    }
                }
                return convertedData;
            });
            console.log(interviewResultHistory);
            setHistory(interviewResultHistory);
            console.log(history)
        } catch (e) {
            console.error('Error getting document:', e);
        }
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '80vh' }}>
            <h1>MailBox</h1>
            <Card variant="outlined" sx={{height:"80%"}}>
            <Stack spacing={0}>                
                {history.map((item, index) => (                   
                        <Card key={index} variant="outlined" sx={{height:52}}>
                            <Link href = {`/mailbox/${item.id}` }>
                            <Typography >{item.feedback.positive}</Typography>
                            <Typography >面接結果のお知らせ</Typography>
                            </Link>
                        </Card>
                    
                    
                ))}
            </Stack>
            <Box sx={{flexGrow:1}}/>
            </Card>
                           
            <Link href='/'>
                        <Button variant="contained" size='small'>
                            戻る
                        </Button>
                </Link>
 
        </Container>
    )
}
