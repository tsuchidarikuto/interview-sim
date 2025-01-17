'use client';
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Card, Stack, Typography, Box,Button, Divider } from '@mui/material';
import { firestore } from '@/firebase';
import { HistoryTypes } from '@/types';
import ResultChart from '@/components/resultChart';
import Grid from '@mui/material/Grid2';
import {AuthContext} from '@/provider/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

export default function MailBox() {
    const [history, setHistory] = useState<HistoryTypes[]>([]);
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
                const interviewResult:any = data;
                return interviewResult;
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
            <Grid container spacing={0} alignItems="center" sx={{mt:2}}>
                                
                                <Grid size = {4}>
                                    <Typography variant="h6" component="h1" sx ={{ml:2}}>Name</Typography>
                                </Grid>
                                <Grid size = {6}>
                                    <Typography variant="h6" component="h1" sx ={{ml:2}}>Title</Typography>
                                </Grid>
                                <Grid size={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Typography variant="h6" component="h1" >Status</Typography>
                                    </Box>
                                </Grid>                                                                        
                            </Grid>
                            <Divider sx={{ width: '100%', bgcolor: 'primary.main'}} />
            <Card variant="outlined" sx={{height:"80%", overflow:"auto"}}>
            <Stack spacing={0}> 
            
                {history.map((item, index) => (                   
                        <Card key={index} variant="outlined" sx={{  height: '100%' }}>
                            <Link href = {`/mailbox/${item.id}` }>
                            <Grid container spacing={0} alignItems="center">
                                
                                <Grid size = {4}>
                                    <Typography variant="h6" component="h1" sx ={{margin:2}}>企業名</Typography>
                                </Grid>
                                <Grid size = {6}>
                                    <Typography variant="h6" component="h1" sx ={{margin:2}}>面接結果のお知らせ</Typography>
                                </Grid>
                                <Grid size={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                {item.isRead ? 
                                    (
                                        item.result.isPass ? <CheckCircleIcon  color = "success" sx={{fontSize:50}}/> : <CancelIcon color ="warning" sx={{fontSize:50}}/>
                                    ):
                                        <HelpIcon color = "disabled" sx={{fontSize:50}}/>
                                }
                                </Box>
                                </Grid>                                                                        
                            </Grid>
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
