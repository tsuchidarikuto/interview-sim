'use client';
import react from 'react';
import { MenuItem, TextField, Container, Box, Typography, Button, Slider, Stack, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import Link from 'next/link';
import { useState,useEffect } from 'react';
import { getSetting } from '@/components/getInfo';
import { SettingTypes } from '@/types';
export default function InterviewSetting() {
    const [settingInfo, setSettingInfo] = useState<SettingTypes[]>([{
        id: "",
        difficulty: 0,
        duration: 0,
        interviewType: ""
    }]);

    useEffect(() => {
        getSetting(setSettingInfo);
    },[]);

    return (
        <>
            <Container maxWidth="md" sx={{ mb: 3 }}>
                <Stack spacing={10}>
                    <Box>
                        <Typography variant="h6" gutterBottom>難易度</Typography>
                        <TextField select fullWidth required size="medium" id="difficulty" variant="standard" value={settingInfo[0].difficulty}>
                            <MenuItem value={1}>簡単</MenuItem>
                            <MenuItem value={2}>普通</MenuItem>
                            <MenuItem value={3}>難しい</MenuItem>
                            <MenuItem value={4}>激ムズ</MenuItem>
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
                            <RadioGroup row value={settingInfo[0].interviewType}>
                                <FormControlLabel value="複合面接" control={<Radio />} label="複合面接" />
                                <FormControlLabel value="技術面接" control={<Radio />} label="技術面接" />
                                <FormControlLabel value="行動面接" control={<Radio />} label="行動面接" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Link href='/interview'>
                        <Button size="large" variant="contained" sx={{width:'100%'}} >面接開始</Button>
                    </Link>
                </Stack>
            </Container>
        </>
    );
}
