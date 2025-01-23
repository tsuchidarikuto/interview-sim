import React,{useContext} from 'react';
import {Box,Button,TextField, CircularProgress,Container, Stack} from '@mui/material';
import { useEffect, useState } from 'react';
import {getInfo,updateInfo,addInfo} from '@/utils/handleFirebase';
import {CompanyTypes} from '@/types';
import { AuthContext } from '@/provider/AuthContext';


export default function Company() {
    const{user} = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isFetchingCompany,setIsFetchingCompany] = useState(true);

    const [companyInfo, setCompanyInfo] = useState<CompanyTypes[]>([{
        uid:"",
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
            if(user){
                if(isNew){
                    await addInfo<CompanyTypes>('company',companyInfo[0],user.uid);
                }
                else{
                    await updateInfo<CompanyTypes>('company',companyInfo[0]);
                }
                setIsLoading(false);
            }
        } catch (e) {
            console.error('Error updating document:', e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            if(user){
                const data = await getInfo<CompanyTypes>('company',user.uid);
                if(data.length===0){
                    setIsNew(true);
                    setIsFetchingCompany(false);
                    return;
                }
                setCompanyInfo(data);
                setIsFetchingCompany(false);
                console.log(`data from Company: ${data}`);
            }
        };
        fetchData();
    }, [])

    if(isFetchingCompany){
        return(
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                <CircularProgress/>
            </Box>
        )
    }

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