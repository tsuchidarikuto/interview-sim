'use client';
import {
    MenuItem,
    TextField,
    Container,
    Box,
    Typography,
    Button,
    Slider,
    Stack,
    FormControl,
    CircularProgress,
    FormControlLabel,
    RadioGroup,
    Radio,
} from '@mui/material';

import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { getArrayDataFromFirestore, updateDataOnFirestore, addDataToFirestore } from '@/utils/handleFirebase';
import { SettingTypes } from '@/types';
import { AuthContext } from '@/provider/AuthContext';

export default function InterviewSetting() {
    
    const { user } = useContext(AuthContext);

    const [settingInfo, setSettingInfo] = useState<SettingTypes[]>([
        {
            uid: '',
            id: '',
            difficulty: '難しい',
            duration: 30,
            interviewType: '',
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);
    
    const [isNew, setIsNew] = useState(false);
    const [isFetchingSetting,setIsFetchingSetting] = useState(true);
    

    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (!user) {
                throw new Error('User not found');
            }

            if (isNew) {
                await addDataToFirestore<SettingTypes>('setting', settingInfo[0], user.uid);
            } else {
                await updateDataOnFirestore<SettingTypes>('setting', settingInfo[0]);
            }
            setIsLoading(false);
        } catch (e) {
            console.error('Error updating document:', e);
        }
        setIsLoading(false);
    };


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (user) {
                const data = await getArrayDataFromFirestore<SettingTypes>('setting', user.uid);
                if (data.length === 0) {
                    setIsNew(true);                                        
                    setSettingInfo([{
                        uid: user.uid,
                        id: '',
                        difficulty: '難しい',
                        duration: 30,
                        interviewType: '複合面接',
                    }]);
                    setIsFetchingSetting(false)
                    return;
                }
                setSettingInfo(data);
                setIsFetchingSetting(false)
            }
        };
        fetchData();
    }, []);

    if(isFetchingSetting){
            return(
                <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                    <CircularProgress/>
                </Box>            
            )
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mb: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={7}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                難易度
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                required
                                size="medium"
                                id="difficulty"
                                variant="standard"
                                value={settingInfo[0].difficulty}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setSettingInfo((prev) => [{ ...prev[0], difficulty: event.target.value }])
                                }
                            >
                                <MenuItem value={'簡単'}>簡単</MenuItem>
                                <MenuItem value={'普通'}>普通</MenuItem>
                                <MenuItem value={'難しい'}>難しい</MenuItem>
                                <MenuItem value={'激ムズ'}>激ムズ</MenuItem>
                            </TextField>
                        </Box>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                面接の長さ: {settingInfo[0].duration}分
                            </Typography>
                            <Slider
                                value={settingInfo[0].duration}
                                defaultValue={30}
                                step={5}
                                marks
                                min={5}
                                max={60}
                                valueLabelDisplay="auto"
                                onChange={(_, newValue) =>
                                    setSettingInfo((prev) => [{ ...prev[0], duration: newValue as number }])
                                }
                            />
                        </Box>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                面接形式
                            </Typography>
                            <FormControl>
                                <RadioGroup
                                    row
                                    value={settingInfo[0].interviewType}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        setSettingInfo((prev) => [{ ...prev[0], interviewType: event.target.value }])
                                    }
                                >
                                    <FormControlLabel value="複合面接" control={<Radio />} label="複合面接" />
                                    <FormControlLabel value="技術面接" control={<Radio />} label="技術面接" />
                                    <FormControlLabel value="行動面接" control={<Radio />} label="行動面接" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Button type="submit" variant="outlined" sx={{ width: 'fit-content', alignSelf: 'left' }}>
                                保存する
                            </Button>
                        )}
                        
                    </Stack>
                </form>
            </Container>
        </>
    );
}
