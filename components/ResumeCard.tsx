import React from 'react';
import { Card, Box, Typography, Button } from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked, Verified, School, Code } from '@mui/icons-material';
import Link from 'next/link';
import type { ResumeTypes, SelectedResumeTypes } from '@/types';

interface ResumeCardProps {
    resume: ResumeTypes;
    selectedResume: SelectedResumeTypes;
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, selectedResume, handleDelete, handleSelect }) => (
    <Card
        variant="outlined"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            border: selectedResume.resumeId === resume.id ? '2px solid black' : undefined,
            width: '100%',
            height: 200,
        }}
    >
        <Box sx={{ p: 1.5, height:50}}>
            <Typography variant="h5"><strong>{resume.name || '未記入'}</strong></Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column',gap:1,mt:1}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {resume.education || '未記入'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Code sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {resume.programming || '未記入'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Verified sx={{ mx: 2 }} />
                <Typography noWrap variant="body2">
                    {resume.qualification || '未記入'}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1,mb:1 ,mr:1}}>
            <Link href={`/resume/${resume.id}`} passHref>
                <Button variant="outlined" size="small" startIcon={<Edit />}>
                    編集
                </Button>
            </Link>
            <Button
                disabled={selectedResume.resumeId === resume.id}
                variant="outlined"
                size="small"
                startIcon={<Delete />}
                onClick={() => resume.id && handleDelete(resume.id)}
            >
                削除
            </Button>
            <Button
                variant={selectedResume.resumeId === resume.id ? 'contained' : 'outlined'}
                size="small"
                startIcon={
                    selectedResume.resumeId === resume.id ? <CheckCircle /> : <RadioButtonUnchecked />
                }
                onClick={() => resume.id && handleSelect(resume.id)}
            >
                {selectedResume.resumeId === resume.id ? '選択中' : '選択'}
            </Button>
        </Box>
    </Card>
);

export default ResumeCard;