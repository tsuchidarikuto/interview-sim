'use client';
import react from 'react';
import {Card,CardContent,CardHeader,Box,Typography,Divider,Button,Slider, CardActions,Stack} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { CustomCard } from '@/app/theme';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
export default function InterviewSetting() {
    const [duration,setDuration]=useState(30);
    const [difficulty,setDifficulty]=useState(3);
    return (
        <CustomCard sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: 2 }}><Typography variant="h5" sx={{ flexGrow: 2 }}>面接設定</Typography><SettingsOutlinedIcon sx={{ fontSize: 40 }} /></Box>
            <Divider sx={{width:'100%',bgcolor:'#000000'}}/>
            <CardContent>
                <Stack spacing={2}>
                <Typography gutterBottom>面接の長さ: {duration}分</Typography>
                <Slider 
                    value={duration} 
                    defaultValue={30} 
                    step={5} 
                    marks min={5} 
                    max={60} 
                    valueLabelDisplay="auto" 
                    onChange={(_,newValue)=>setDuration(newValue as number)}
                />
                <Typography gutterBottom>審査の難易度: {difficulty}分</Typography>
                <Slider 
                    value={difficulty} 
                    defaultValue={3} 
                    step={1} 
                    marks 
                    min={1} 
                    max={5} 
                    valueLabelDisplay="auto" 
                    onChange={(_,newValue)=>setDifficulty(newValue as number)}
                />
                </Stack>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <CardActions sx={{ justifyContent: 'center' }}>
                <Link href="/interview">
                    <Button variant="contained" size="large" sx={{ width: '300px',bottom:10 }}>
                        面接開始
                    </Button>
                </Link>
            </CardActions>    
        </CustomCard>
    );
}
