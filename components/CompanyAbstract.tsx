'use client';
import react from 'react';
import {Card,CardContent,Container,CardHeader,Typography,CardActions,Button} from '@mui/material';
import Link from 'next/link';
import { CustomCard } from '@/app/theme';

const companyInfo = {
    name: "株式会社テック",
    position: "フロントエンドエンジニア",
    description: "最先端のWeb技術を活用した開発"
 };


export default function CompanyAbstruct() {
    return (
        
        <CustomCard>
            <CardHeader title="企業情報" />
            <CardContent>
                <Typography><strong>企業名:</strong> {companyInfo.name}</Typography>
                <Typography><strong>募集職種:</strong> {companyInfo.position}</Typography>
                <Typography><strong>事業内容:</strong> {companyInfo.description}</Typography>
            </CardContent>
            <CardActions>
                <Link href="/company">
                    <Button variant="contained" size="small" sx={{bottom:0}}>
                        編集
                    </Button>
                </Link>                
            </CardActions>
        </CustomCard>
        
    );
  }
  
  