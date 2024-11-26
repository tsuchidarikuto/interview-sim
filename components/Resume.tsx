'use client';
import { FunctionComponent, use } from "react";
import { Box, Button, TextField, Typography, Container, Stack, Card, Divider, Select, MenuItem } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from 'react';
import { ResumeTypes } from '@/types';
import { getResume } from '@/components/getInfo';

export default function Resume() {
    const [resumeInfo, setResumeInfo] = useState<ResumeTypes[]>([{
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

    useEffect(() => {
        getResume(setResumeInfo);
    }, []);

    return (
        <Container maxWidth="md" sx={{ mb: 3, height: '100%' }}>
            <Box sx={{mb:3}}>
            <Stack spacing={2}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField sx={{width:'100%'}} required id="name" label="氏名" variant="standard" value={resumeInfo[0].name} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth required size="medium" id="age" label="年齢" variant="standard" type="number" value={resumeInfo[0].age} />
                    </Grid>
                    <Grid size={3}>
                        <TextField select fullWidth required size="medium" id="sex" label="性別" variant="standard" value={resumeInfo[0].sex}>
                            <MenuItem value={1}>男性</MenuItem>
                            <MenuItem value={2}>女性</MenuItem>
                            <MenuItem value={3}>その他</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <TextField fullWidth size="medium" required id="最終学歴" label="最終学歴" variant="standard" value={resumeInfo[0].education} />
                <TextField required fullWidth multiline maxRows={4} size="medium" id="資格" label="資格" variant="standard" value={resumeInfo[0].qualification} />
                <TextField required fullWidth multiline maxRows={4} size="medium" id="研究成果" label="研究成果" variant="standard" value={resumeInfo[0].research} />
                <TextField required fullWidth multiline maxRows={4} size="medium" id="プログラミングの経験・使用言語" label="プログラミングの経験・使用言語" variant="standard" value={resumeInfo[0].programming} />
                <TextField multiline rows={3} required fullWidth  size="medium" id="自己PR" label="自己PR" variant="standard" value={resumeInfo[0].selfPR} />                                
                <TextField multiline rows={3} required fullWidth  size="medium" id="学生時代頑張ったこと" label="学生時代頑張ったこと" variant="standard" value={resumeInfo[0].bestAtStu} />
                <TextField multiline rows={3} required fullWidth  size="medium" id="志望理由" label="志望理由" variant="standard" value={resumeInfo[0].reason} />
                
            </Stack>
            </Box>
            <Button variant="outlined">保存する</Button>
        </Container>
        
    );
}
