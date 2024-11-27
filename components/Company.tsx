import React from 'react';
import  Link  from 'next/link';
import {Box,Button,TextField, CircularProgress,Container, Stack,Divider} from '@mui/material';
import { useEffect, useState } from 'react';
import {getInfo,updateInfo} from '@/components/getInfo';
import {CompanyTypes} from '@/types';
export default function Company() {
    const [isLoading, setIsLoading] = useState(false);
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
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await updateInfo<CompanyTypes>('company', companyInfo[0]);
            setIsLoading(false);
        } catch (e) {
            console.error('Error updating document:', e);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        const fetchData = async () => {
            const data = await getInfo<CompanyTypes>('company');
            if (data) {
                setCompanyInfo(data);
            }
        };
        fetchData();
    }, [])
    return (
        
        <Container maxWidth="md" sx={{mb:3}}>
            <form onSubmit={handleSubmit}>
            <Box sx={{mb:3}}>
        <Stack spacing={5}>


        <TextField fullWidth id="会社名" label="会社名" variant="standard" value={companyInfo[0].name} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],name:event.target.value}])}/>
        <TextField fullWidth id="採用ポジション" label="採用ポジション" variant="standard" value={companyInfo[0].position}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],position:event.target.value}])}/>
        <TextField fullWidth id="必須スキルセット" label="必須スキルセット" variant="standard" value={companyInfo[0].skillset}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],skillset:event.target.value}])}/>
        
        <TextField fullWidth id="主力製品・サービス" label="主力製品・サービス" variant="standard" value={companyInfo[0].product}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],product:event.target.value}])}/>
        <TextField fullWidth id="社風" label="社風" variant="standard" value={companyInfo[0].culture}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],culture:event.target.value}])}/>
        <TextField multiline rows={3} fullWidth id="会社のミッション・ビジョン" label="会社のミッション・ビジョン" variant="standard" value={companyInfo[0].mission}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],mission:event.target.value}])}/>
        <TextField multiline rows={3} fullWidth id="その他特記事項" label="その他特記事項" variant="standard" value={companyInfo[0].others}onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setCompanyInfo(prev=>[{...prev[0],others:event.target.value}])}/>
        
        </Stack>
        </Box>
        {isLoading ? <CircularProgress /> : <Button type="submit" variant="outlined">保存する</Button>}        
        </form>
        </Container>
        
        
        
    )
};