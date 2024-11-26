import React from 'react';
import  Link  from 'next/link';
import {Box,Button,TextField, Typography,Container, Stack,Divider} from '@mui/material';
import  Grid  from "@mui/material/Grid2";
import { useEffect, useState } from 'react';
import {getCompany} from '@/components/getInfo';
import {CompanyTypes} from '@/types';
export default function Company() {
    const [companyInfo, setCompanyInfo] = useState<CompanyTypes[]>([{
        id: "",
        name: "",
        position: "",
        skillset: "",
        mission: "",
        product: "",
        culture: "",
        others: ""
    }]);
    useEffect(()=>{
        getCompany(setCompanyInfo);
    },[])
    return (
        
        <Container maxWidth="md" sx={{mb:3}}>
            <Box sx={{mb:3}}>
        <Stack spacing={5}>


        <TextField fullWidth id="会社名" label="会社名" variant="standard" value={companyInfo[0].name}/>
        <TextField fullWidth id="採用ポジション" label="採用ポジション" variant="standard" value={companyInfo[0].position}/>
        <TextField fullWidth id="必須スキルセット" label="必須スキルセット" variant="standard" value={companyInfo[0].skillset}/>
        
        <TextField fullWidth id="主力製品・サービス" label="主力製品・サービス" variant="standard" value={companyInfo[0].product}/>
        <TextField fullWidth id="社風" label="社風" variant="standard" value={companyInfo[0].culture}/>
        <TextField multiline rows={3} fullWidth id="会社のミッション・ビジョン" label="会社のミッション・ビジョン" variant="standard" value={companyInfo[0].mission}/>
        <TextField multiline rows={3} fullWidth id="その他特記事項" label="その他特記事項" variant="standard" value={companyInfo[0].others}/>
        
        </Stack>
        </Box>
        <Button variant="outlined">保存する</Button>
        </Container>
        
        
        
    )
};