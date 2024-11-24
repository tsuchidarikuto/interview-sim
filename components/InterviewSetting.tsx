'use client';
import react from 'react';
import {Card,CardContent,CardHeader,Typography,Button,Slider, CardActions} from '@mui/material';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { CustomCard } from '@/app/theme';


export default function InterviewSetting() {
    const [duration,setDuration]=useState(30);
    const [difficulty,setDifficulty]=useState(3);
    return (
        <CustomCard>
            <CardHeader title="面接設定" />
            <CardContent>
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
            </CardContent>
            <CardActions>
                <Link href="/interview">
                    <Button variant="contained" size="small">
                        面接開始
                    </Button>
                </Link>
            </CardActions>    
        </CustomCard>
    );
  }
  
  