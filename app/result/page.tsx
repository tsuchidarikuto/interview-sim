'use client';
import { Container, Typography, Divider, Stack, Card, Button ,Box} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResultChart from "@/components/resultChart";
import Link from 'next/link';
import { useAtom } from 'jotai';
import { interviewResultAtom } from '@/atoms/state';

export default function Result() {
    const [interviewResult,] = useAtom(interviewResultAtom);

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '80vh' }}>
            <Typography variant="h4" component="h1">結果</Typography>
            <Divider sx={{ width: '100%', bgcolor: 'primary.main', mb: 2}} />
            
                <Stack spacing={5}>
                    <Card sx={{ p: 2 }} variant="outlined">
                    {interviewResult.isPass ?
                        <Typography variant="h5">
                            厳正な審査の結果、<span style={{ color: 'green' }}>採用</span>が決定しました。
                        </Typography>
                        : <Typography variant="h5">
                            残念ながら今回は<span style={{ color: 'red' }}>不採用</span>となりました。
                        </Typography>
                    }
                    </Card>
                    <Grid container spacing={5} >
                            <Grid size={{ xs: 6, md: 6 }}>        
                                <Card sx={{ p: 2 }} variant="outlined">                        
                                    <Box sx={{ width: "100%", margin: "0 auto" }}>
                                    {ResultChart(interviewResult.score)}
                                    </Box>                                
                                    </Card>
                            </Grid>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography variant="h6" component="h2">良かった点</Typography>
                                    <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography sx={{ width: '100%', marginLeft: 1 }}>
                                        {interviewResult.feedback.positive}
                                    </Typography>
                                    </Card>
                                
                                    <Typography variant="h6" component="h2" sx={{mt:1}}>改善点</Typography> 
                                    <Card sx={{ p: 2 }} variant="outlined">
                                    <Typography sx={{ width: '100%', marginLeft: 1 }}>
                                            {interviewResult.feedback.negative}
                                        </Typography>
                                    </Card>
                                </Card>
                            </Grid>
                        </Grid>
                    <Link href='/'>
                        <Button variant="contained" size='small'>
                            戻る
                        </Button>
                    </Link>
                </Stack>            
        </Container>
    )
};
