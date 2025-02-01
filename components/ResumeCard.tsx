import React from 'react';
import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Link from 'next/link';
import type { ResumeTypes, SelectedResumeTypes } from '@/types';

interface ResumeCardProps {
    resume: ResumeTypes;
    selectedResume: SelectedResumeTypes;
    handleDelete: (id: string) => void;
    handleSelect: (id: string) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, selectedResume, handleDelete, handleSelect }) => (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', border: selectedResume.selectedResumeId === resume.id ? '2px solid black' : undefined, width: '100%'}}>
        <CardHeader title={resume.name} />
        <CardContent>
            <Typography variant="body2"><strong>年齢:</strong> {resume.age}</Typography>
            <Typography variant="body2"><strong>最終学歴:</strong> {resume.education}</Typography>
            <Typography variant="body2"><strong>プログラミング経験:</strong> {resume.programming}</Typography>
        </CardContent>
        <CardActions sx={{ mt: 'auto', justifyContent: 'space-between' }}>
            <Link href={`/resume/${resume.id}`}>
                <Button variant="outlined" size="small" startIcon={<Edit />}>
                    編集
                </Button>
            </Link>
            <Button
                disabled={selectedResume.selectedResumeId === resume.id}
                variant="outlined"
                size="small"
                startIcon={<Delete />}
                onClick={() => handleDelete(resume.id)}
            >
                削除
            </Button>
            <Button
                variant={selectedResume.selectedResumeId === resume.id ? "contained" : "outlined"}
                size="small"
                onClick={() => handleSelect(resume.id)}
            >
                {selectedResume.selectedResumeId === resume.id ? "選択中" : "選択"}
            </Button>
        </CardActions>
    </Card>
);

export default ResumeCard;