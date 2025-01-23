'use client';
import React from "react";
import { Box,CircularProgress, Button, TextField,  Container, Stack, MenuItem } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useEffect, useState ,FormEvent,useContext} from 'react';
import { ResumeTypes } from '@/types';
import { getInfo ,updateInfo,addInfo} from '@/utils/handleFirebase';
import { AuthContext } from '@/provider/AuthContext';
import { set } from "zod";


export default function Resume() {
    const {user}=useContext(AuthContext);

    const [resumeInfo, setResumeInfo] = useState<ResumeTypes[]>([{
        uid:"",
        id: "",
        name: "",
        birth: "",
        age: "",
        sex: 0,
        education: "",
        programming: "",
        selfPR: "",
        research: "",
        qualification: "",
        bestAtStu: "",
        reason: ""
    }]);
    const [isNew, setIsNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingResume,setIsFetchingResume] = useState<boolean>(true);

    const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();        
        setIsLoading(true);
        try{
            if(user){
                if(isNew){
                    await addInfo<ResumeTypes>('resumes',resumeInfo[0],user.uid);
                }else{
                    await updateInfo<ResumeTypes>('resumes',resumeInfo[0]);
                }
                setIsLoading(false);
            }
        } catch(e){
            console.error('Error updating document:', e);

        };
        setIsLoading(false);
    }
        
    

    useEffect(() => {
        const fetchData = async () => {
            if(user){
                const data = await getInfo<ResumeTypes>('resumes',user.uid);
                if (data.length === 0) {
                    setIsNew(true);
                    setIsFetchingResume(false);
                    return;
                }
                setResumeInfo(data);
                setIsFetchingResume(false);                
            }
        };
        fetchData();
    }, [user]);

    if(isFetchingResume){
        return(
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                            <CircularProgress/>
            </Box>            
        )
    }

    return (
        <Container maxWidth="md" sx={{ mb: 3, height: '100%' }}>
            <form onSubmit={handleSubmit}>
            <Box sx={{mb:3}}>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField sx={{width:'100%'}} required id="name" label="氏名" variant="standard" value={resumeInfo[0].name} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],name:event.target.value}])}/>
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth required size="medium" id="age" label="年齢" variant="standard" type="number" value={resumeInfo[0].age} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],age:event.target.value}])}/>
                    </Grid>
                    <Grid size={3}>
                        <TextField select fullWidth required size="medium" id="sex" label="性別" variant="standard" value={resumeInfo[0].sex} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],sex:Number(event.target.value)}])}>
                            <MenuItem value={1}>男性</MenuItem>
                            <MenuItem value={2}>女性</MenuItem>
                            <MenuItem value={3}>その他</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <TextField fullWidth size="medium" required id="最終学歴" label="最終学歴" variant="standard" value={resumeInfo[0].education} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],education:event.target.value}])}/>
                <TextField required fullWidth  size="medium" id="資格" label="資格" variant="standard" value={resumeInfo[0].qualification} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],qualification:event.target.value}])}/>
                <TextField required fullWidth multiline maxRows={4} size="medium" id="研究成果" label="研究成果" variant="standard" value={resumeInfo[0].research} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],research:event.target.value}])}/>
                <TextField required fullWidth multiline maxRows={4} size="medium" id="プログラミングの経験・使用言語" label="プログラミングの経験・使用言語" variant="standard" value={resumeInfo[0].programming} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],programming:event.target.value}])}/>
                <TextField multiline rows={3} required fullWidth  size="medium" id="自己PR" label="自己PR" variant="standard" value={resumeInfo[0].selfPR} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],selfPR:event.target.value}])}/>                                
                <TextField multiline rows={3} required fullWidth  size="medium" id="学生時代頑張ったこと" label="学生時代頑張ったこと" variant="standard" value={resumeInfo[0].bestAtStu} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],bestAtStu:event.target.value}])}/>
                <TextField multiline rows={3} required fullWidth  size="medium" id="志望理由" label="志望理由" variant="standard" value={resumeInfo[0].reason} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setResumeInfo(prev=>[{...prev[0],reason:event.target.value}])}/>
                
            </Stack>
            </Box>
            {isLoading ?
            <CircularProgress />:
            <Button type="submit" disabled={isLoading}variant="outlined" >保存する</Button>
            }
            </form>
        </Container>
        
    );
}
