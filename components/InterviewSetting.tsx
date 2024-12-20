'use client';
import react from 'react';
import { MenuItem, TextField, Container, Box, Typography, Button, Slider, Stack, FormControl, CircularProgress, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import  LinearProgressWithLabel  from '@/components/LinearProgressWithLabel';
import {useRouter} from 'next/navigation';
import React, { useState,useEffect } from 'react';
import { getInfo,updateInfo } from '@/utils/getInfo';
import { SettingTypes } from '@/types';
import { PreparationInterview } from '@/utils/PreparationInterview';
import {useAtom} from 'jotai';
import {questionsAtom} from '@/atoms/state';

export default function InterviewSetting() {
    const {push} = useRouter();
    
    const [settingInfo, setSettingInfo] = useState<SettingTypes[]>([{
        id: "",
        difficulty: "難しい",
        duration: 30,
        interviewType: ""
    }]);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadInterview ,setIsLoadInterview] = useState(false);
    const [progress, setProgress] = useState(0);

    const [questions,setQuestions] = useAtom(questionsAtom);

    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await updateInfo<SettingTypes>('setting', settingInfo[0]);
            setIsLoading(false);
        } catch (e) {
            console.error('Error updating document:', e);
        }
        setIsLoading(false);
    }

    const handleStartInterview = async () => {
        setIsLoadInterview(true);    
        try {
            setProgress(10);
            const data = await PreparationInterview(setProgress);
            
            const obj=JSON.parse(data);
            setQuestions(obj.questions);
            setProgress(100);
            push('/interview');
            
            
        } catch (e) {
            console.error('Error during preparation:', e);
        }
        
        setIsLoading(false);
    }
    

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInfo<SettingTypes>('setting');
            if (data) {
                setSettingInfo(data);
            }
        };
        fetchData();
    }, [])

    useEffect(()=>{
        console.log(questions);
    },[questions])
    
    return (
        <>
            <Container maxWidth="md" sx={{ mb: 3 }}>
                <form onSubmit={handleSubmit}>
                <Stack spacing={7}>
                    <Box>
                        <Typography variant="h6" gutterBottom>難易度</Typography>
                        <TextField select fullWidth required size="medium" id="difficulty" variant="standard" value={settingInfo[0].difficulty }
                        onChange={(event:React.ChangeEvent<HTMLInputElement>) => setSettingInfo(prev => [{ ...prev[0], difficulty: event.target.value }])}>
                            <MenuItem value={"簡単"}>簡単</MenuItem>
                            <MenuItem value={"普通"}>普通</MenuItem>
                            <MenuItem value={"難しい"}>難しい</MenuItem>
                            <MenuItem value={"激ムズ"}>激ムズ</MenuItem>
                        </TextField>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>面接の長さ: {settingInfo[0].duration}分</Typography>
                        <Slider
                            value={settingInfo[0].duration}
                            defaultValue={30}
                            step={5}
                            marks min={5}
                            max={60}
                            valueLabelDisplay="auto"
                            onChange={(_, newValue) => setSettingInfo(prev => [{ ...prev[0], duration: newValue as number }])}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>面接形式</Typography>
                        <FormControl>
                            <RadioGroup row value={settingInfo[0].interviewType} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setSettingInfo(prev=>[{...prev[0],interviewType:event.target.value}])}>
                                <FormControlLabel value="複合面接" control={<Radio />} label="複合面接" />
                                <FormControlLabel value="技術面接" control={<Radio />} label="技術面接" />
                                <FormControlLabel value="行動面接" control={<Radio />} label="行動面接" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    {isLoading ? <CircularProgress /> : <Button type="submit" variant="outlined" sx={{width:'fit-content',alignSelf:'left'}}>保存する</Button>}        

                    {isLoadInterview ? 
                    <LinearProgressWithLabel  value={progress} />:
                    <Button size="large" variant="contained" sx={{width:'100%'}} onClick={handleStartInterview}>面接開始</Button>
                    }
                    
                </Stack>
                </form>
            </Container>
        </>
    );
}
