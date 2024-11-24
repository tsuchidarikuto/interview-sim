'use client';
import { Container,Typography,Divider ,Stack,Card,Button} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ResultChart from "@/components/resultChart";
import Link from 'next/link';

export default function Result(){
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}} >       
            <Typography variant="h4" component="h1" >　結果</Typography>
                <Divider sx={{width:'100%', bgcolor: 'primary.main'}} />
                    <Container maxWidth="md" sx={{ mt: 1,mb:3}}>
                    <Stack spacing={5}>
                        <Typography variant="h5">厳正な審査の結果、採用させていただきます。</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12, md:6}}>
                        <ResultChart/>          
                        </Grid>
                        <Grid size={{xs:12, md:6}}>
                        
                        <Card sx={{height:'100%',width:'100%'}}>
                            <Typography variant="h6" component="h2" >フィードバック</Typography>
                            <Divider sx={{width:'100%', bgcolor: '#555555'}} />
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
                    
        </Container>
    )
};
