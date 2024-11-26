'use client';
import react from 'react';
import { MenuItem, TextField, Container, Box, Typography, Button, Slider, Stack, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { CustomCard } from '@/app/theme';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function InterviewSetting() {
    const [duration, setDuration] = useState(30);
    const [difficulty, setDifficulty] = useState(3);
    const [interviewType, setInterviewType] = useState("複合面接");

    return (
        <>
            <Container maxWidth="md" sx={{ mb: 3 }}>
                <Stack spacing={10}>
                    <Box>
                        <Typography variant="h6" gutterBottom>難易度</Typography>
                        <TextField select fullWidth required size="medium" id="difficulty" variant="standard" value={difficulty}>
                            <MenuItem value={1}>簡単</MenuItem>
                            <MenuItem value={2}>普通</MenuItem>
                            <MenuItem value={3}>難しい</MenuItem>
                            <MenuItem value={4}>激ムズ</MenuItem>
                        </TextField>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>面接の長さ: {duration}分</Typography>
                        <Slider
                            value={duration}
                            defaultValue={30}
                            step={5}
                            marks min={5}
                            max={60}
                            valueLabelDisplay="auto"
                            onChange={(_, newValue) => setDuration(newValue as number)}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>面接形式</Typography>
                        <FormControl>
                            <RadioGroup row>
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
