'use client';
import {
    MenuItem,
    TextField,
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
    Card,
    CardContent,
    CardHeader,
    Checkbox,
} from '@mui/material';
import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { SettingTypes } from '@/types';
import { SupabaseDatabase } from '@/utils/supabase/database';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';
import { createClient } from '@/utils/supabase/client';

export default function InterviewSetting() {
    
    const [user, ]= useAtom(userAtom);
    const supabase = createClient();
    const [settingInfo, setSettingInfo] = useState<SettingTypes[]>([
        {
            uid: '',
            id: '',
            difficulty: '難しい',
            duration: 30,
            interviewType: '',
            interviewMode: 'voice'
        }
    ]);

    const settingTable = new SupabaseDatabase<SettingTypes>("settings", supabase);

    const [isLoading, setIsLoading] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isFetchingSetting, setIsFetchingSetting] = useState(true);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {        
        event.preventDefault();
        setIsLoading(true);
        

        
        try {
            if (!user) {
                throw new Error('User not found');
            }

            if (isNew) {
                await settingTable.addData(settingInfo[0],user.uid);
            } else {
                if (!settingInfo[0].id) {
                    throw new Error('Setting ID not found');
                }
                await settingTable.updateData(settingInfo[0].id,settingInfo[0]);
            }
            setIsLoading(false);
        } catch (e) {
            console.error('Error updating document:', e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (user&&user.uid) {
                const data = await settingTable.getArrayDataByUserId(user.uid);
                if (data.length === 0) {
                    setIsNew(true);
                    setIsFetchingSetting(false);
                    return;
                }
                setSettingInfo(data);
                setIsFetchingSetting(false);
            }
        };
        fetchData();
    }, [user]);

    const handleModeSelect = (mode: "voice" | "chat") => {
        setSettingInfo((prev) => [{ ...prev[0], interviewMode: mode }]);
    };

    return (
        <Box>
            <Card variant="outlined" sx={{ p: 1, pb: 0, height: { md: 740 } }}>
                <CardHeader
                    title="面接設定"
                    subheader="面接の形式を設定できます。"
                    subheaderTypographyProps={{ sx: { fontSize: { xs: '0.8rem', sm: '1rem' } } }}
                />
                <CardContent sx={{ pt: 3 }}>
                    {isFetchingSetting ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 545 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={6}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 0 }}>
                                        難易度
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
                                            sx={{ width: "90%" }}
                                        >
                                            <MenuItem value={'簡単'}>簡単</MenuItem>
                                            <MenuItem value={'普通'}>普通</MenuItem>
                                            <MenuItem value={'難しい'}>難しい</MenuItem>
                                            <MenuItem value={'激ムズ'}>激ムズ</MenuItem>
                                        </TextField>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 0 }}>
                                        面接の長さ: {settingInfo[0].duration}分
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
                                            sx={{ width: "85%" }}
                                        />
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 0 }}>
                                        面接形式
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
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
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                                        面接モードの選択
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", gap: 2 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                position: "relative",
                                                cursor: "pointer",
                                                border:
                                                    settingInfo[0].interviewMode === "voice"
                                                        ? "3px solid #000000"
                                                        : "1px solid rgba(0, 0, 0, 0.12)",
                                                width: "100%",
                                                height: 180
                                            }}
                                            onClick={() => handleModeSelect("voice")}
                                        >
                                            <Checkbox checked={settingInfo[0].interviewMode === "voice"} sx={{pb:0,px:1.5}}/>
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				                                <Box
					                                sx={{						                                
												        backgroundImage: 'url(/speech.svg)',
												        backgroundSize: 'contain',
												        backgroundRepeat: 'no-repeat',
												        backgroundPosition: 'center',
												        height: 100,
												        width: 100,
											        }}
										        />
                                                
									        </Box>
                                            <Typography variant="body1" sx={{textAlign:"center",p:1,fontWeight:"bold"}}>
                                                音声
                                            </Typography>
                                        </Card>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                position: "relative",
                                                cursor: "pointer",
                                                border:
                                                    settingInfo[0].interviewMode === "chat"
                                                        ? "3px solid #000000"
                                                        : "1px solid rgba(0, 0, 0, 0.12)",
                                                width: "100%",
                                                height: 180
                                            }}
                                            onClick={() => handleModeSelect("chat")}
                                        >
                                            <Checkbox checked={settingInfo[0].interviewMode === "chat"} sx={{pb:0,px:1.5}}/>
                                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				                                <Box
					                                sx={{						                                
												        backgroundImage: 'url(/chat.svg)',
												        backgroundSize: 'contain',
												        backgroundRepeat: 'no-repeat',
												        backgroundPosition: 'center',
												        height: 100,
												        width: 100,
											        }}
										        />
									        </Box>
                                            <Typography variant="body1" sx={{textAlign:"center",p:1,fontWeight:"bold"}}>
                                                チャット
                                            </Typography>
                                        </Card>
                                    </Box>
                                </Box>
                            </Stack>
                            {isLoading ? (
                                <CircularProgress sx={{ width: 'fit-content', alignSelf: 'left', mt: 2 }}/>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    sx={{ width: 'fit-content', alignSelf: 'left', mt: 2 }}
                                >
                                    保存する
                                </Button>
                            )}
                        </form>
                    )}
                    
                </CardContent>
            </Card>
        </Box>
    );
}
