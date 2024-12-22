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


export default function History() {
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
                const convertedData: interviewResultTypes = {
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
            <Stack spacing={5}>
                <h1>History</h1>
                {history.map((item, index) => (
                    <Card key={index} sx={{ p: 2 }} variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: 2 }}>
                            {item.isPass ?
                                <Typography variant="h4" sx={{ color: 'green' }}>
                                    採用
                                </Typography>
                                : <Typography variant="h4" sx={{ color: 'red' }}>
                                    不採用
                                </Typography>
                            }
                        </Box>
                        <Grid container spacing={5} >
                            <Grid size={{ xs: 6, md: 6 }}>
                                
                                    <Box sx={{ width: "100%", margin: "0 auto" }}>
                                    {ResultChart(item.score)}
                                    </Box>
                                
                            </Grid>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography variant="h6" component="h2">良かった点</Typography>
                                    <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography sx={{ width: '100%', marginLeft: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.feedback.positive}
                                    </Typography>
                                    </Card>
                                    <Box sx={{ flexGrow: 1 }} />
                                
                                    <Typography variant="h6" component="h2" sx={{mt:1}}>改善点</Typography> 
                                    <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography sx={{ width: '100%', marginLeft: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.feedback.negative}
                                        </Typography>
                                    </Card>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
                <Link href='/'>
                        <Button variant="contained" size='small'>
                            戻る
                        </Button>
                </Link>
            </Stack>
        </Container>
    )
}
