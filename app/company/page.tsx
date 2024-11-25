import React from 'react';
import  Link  from 'next/link';
import {Box,Button,TextField, Typography,Container, Stack,Divider} from '@mui/material';
import  Grid  from "@mui/material/Grid2";

export default function Company() {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,pb:10}}>
        <Typography variant="h4" component="h1" >　会社情報</Typography>
        <Divider sx={{width:'100%', bgcolor: 'primary.main'}} />
        <Container maxWidth="md" sx={{ mt: 3,mb:3}}>
        <Stack spacing={5}>

        <TextField fullWidth id="会社名" label="会社名" variant="filled" />
        <TextField fullWidth id="採用ポジション" label="採用ポジション" variant="filled" />
        <TextField fullWidth id="必須スキルセット" label="必須スキルセット" variant="filled" />
        <TextField multiline rows={3} fullWidth id="会社のミッション・ビジョン" label="会社のミッション・ビジョン" variant="filled" />
        <TextField fullWidth id="主力製品・サービス" label="主力製品・サービス" variant="filled" />
        <TextField fullWidth id="社風" label="社風" variant="filled" />
        <TextField fullWidth id="その他特記事項" label="その他特記事項" variant="filled" />
        
        </Stack>
        </Container>
        <Divider sx={{width:'100%', bgcolor: 'primary.main'}} />
        <Box sx={{mt:2}}>
        <Grid container spacing={2}>
        <Grid>
        <Link href='/'>
            <Button variant="contained" size='small'>
                戻る
            </Button>
        </Link>
        </Grid>
        <Grid>
        <Link href='/resume'>
            <Button  variant="contained" size='small'>
                エントリーシートを編集する
            </Button>
        </Link>
        </Grid>
        </Grid>
        </Box>
        </Container>
        
    )
};
