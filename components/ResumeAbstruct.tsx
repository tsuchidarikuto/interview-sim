'use client';
import react from 'react';
import {Box,Card,CardContent,CardHeader,Typography,CardActions,Button} from '@mui/material';
import Link from 'next/link';
import { CustomCard } from '@/app/theme';


export default function ResumeAbstruct() {
    const resumeInfo = {
      name: "山田 太郎",
      education: "○○大学 ○○学部",
      skills: "React, TypeScript, Node.js"
    };

    return (
        <CustomCard>
        <CardHeader title="履歴書情報" />
                
        <CardContent>          
          <Typography><strong>名前:</strong> {resumeInfo.name}</Typography>
          <Typography><strong>学歴:</strong> {resumeInfo.education}</Typography>
          <Typography><strong>スキル:</strong> {resumeInfo.skills}</Typography>
        </CardContent>
        
        <CardActions >
          <Link href="/resume">
            <Button variant="contained" size="small">
              編集
            </Button>
          </Link>
        </CardActions>
        
      </CustomCard>
    );
  }
  
  