'use client';
import { Container, Typography, Divider, Stack, Card, Button } from '@mui/material';
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
            <Divider sx={{ width: '100%', bgcolor: 'primary.main' }} />
            <Container maxWidth="md" sx={{ mt: 1, mb: 3 }}>
                <Stack spacing={5}>
                    {interviewResult.isPass ?
                        <Typography variant="h5">厳正な審査の結果、採用させていただきます。</Typography>
                        : <Typography variant="h5">残念ながら不採用となりました。</Typography>
                    }
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 12 }}>
                            {ResultChart(interviewResult.score)}
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: '100%', width: '100%' }}>
                                    <Typography variant="h6" component="h2">良かった点</Typography>
                                    <Typography variant="body1" component="p">{interviewResult.feedback.positive}</Typography>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: '100%', width: '100%' }}>
                                    <Typography variant="h6" component="h2">改善点</Typography>
                                    <Typography variant="body1" component="p">{interviewResult.feedback.negative}</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Link href='/'>
                        <Button variant="contained" size='small'>
                            戻る
                        </Button>
                    </Link>
                </Stack>
            </Container>
        </Container>
    )
};
