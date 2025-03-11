"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HistoryDataTypes, RankingTypes } from '@/types';
import Link from 'next/link';
import ResultChart from '@/components/resultChart';
import {
    Card,
    CardHeader,
    CardContent, 
    Avatar,
    Typography,
    Chip,
    Divider,
    Box,
    Button,
    CircularProgress,
    Stack
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BuildIcon from '@mui/icons-material/Build';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Settings} from '@mui/icons-material';
import InterestShiftChart from '@/components/InterestShiftChart';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';
import { HandleHistoryTable } from '@/utils/handleHistoryTable';
import { createClient } from '@/utils/supabase/client';
import { SupabaseDatabase } from '@/utils/supabase/database';

export default function Page() {
    const [user,] = useAtom(userAtom);    
    const { resultId } = useParams();
    const [selectedHistory, setSelectedHistory] = useState<HistoryDataTypes>();
    const historyTableHandler = new HandleHistoryTable();
    
    useEffect(() => {
        const getResult = async () => {
            try {
                if(resultId){                    
                    const id = Array.isArray(resultId) ? resultId[0] : resultId;
                    const historyData:HistoryDataTypes = await historyTableHandler.getAllHistoryData(id);
                    setSelectedHistory(historyData);
                    await historyTableHandler.updateStatus(id,"isRead",true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getResult();
    }, [resultId, user]);

    if (!selectedHistory) {
        return (
            <Box sx={{width: "100%",display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Card variant="outlined" sx={{width: 800,height:600,mt:2}}>
                <Box sx={{ maxWidth: 800,display: 'flex', justifyContent: 'center', alignItems: 'center',height: 600 ,p: 2 }}>
                    <CircularProgress />
                    </Box>
                </Card>
            </Box>
        );
    }

    async function addRanking(){
        try {
            const supabase = createClient();
            const rankingTable = new SupabaseDatabase<RankingTypes>("rankings",supabase);
            const rankingData = {                
                totalScore: totalScore,
                userName: resume.name,
                difficulty: setting.difficulty,                
            }
            if (user) {
                await rankingTable.addData(rankingData, user.uid);
            }
            if (resultId) {
                const id = Array.isArray(resultId) ? resultId[0] : resultId;
                await historyTableHandler.updateStatus(id,"isRankIn",true);
                
                
                setSelectedHistory(prevState => {
                    if (prevState) {
                        return { ...prevState, isRankIn: true };
                    }
                    return prevState;
                });
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const { isRankIn,result, company, resume, setting, time,interestShift,totalScore } = selectedHistory;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card variant="outlined">
                <CardHeader
                    avatar={
                        <Avatar alt={company.name}>
                            {company.name}
                        </Avatar>
                    }
                    title={company.name}
                    subheader={`${time}`}
                    action={
                        <Chip
                            label={result.isPass ? 'Passed' : 'Failed'}
                            color={result.isPass ? 'success' : 'error'}
                        />
                    }
                />
                <CardContent>
                    <Box sx={{ height: "60vh", overflowY: 'auto', pr: 2 }}>
                        <Typography variant="h6" sx={{my:2}}>
                            {resume.name} 様
                        </Typography>
    
                        
                        <Typography sx={{ whiteSpace: 'pre-line' }}>
                            {result.isPass 
                                ? "この度は、選考にご参加いただき、誠にありがとうございました。\n\n" +
                                  "厳正なる選考の結果、貴殿の能力とご経験が弊社の求める人物像と合致すると判断いたしましたので、内定をご通知させていただきます。"
                                : "この度は、選考にご参加いただき、誠にありがとうございました。\n\n" +
                                  "慎重に選考を重ねました結果、誠に残念ながら、今回は貴意に沿いかねる結果となりました。\n\n" +
                                  "貴殿の今後のご活躍を心よりお祈り申し上げます。"}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                            フィードバック
                        </Typography>
                        <br/>
                        <Typography >
                            <strong>評価できる点:</strong> <br/>
                            {
                                result.positiveFeedback.length!=0 ?
                                (result.positiveFeedback):
                                "特になし"
                            }
                        </Typography>
                        <br/>
                        <Typography >
                            <strong>改善を期待する点:</strong> <br/>
                            {result.negativeFeedback}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                            項目別の評価
                        </Typography>                                                
                        
                        <Box sx={{ display: 'flex', alignItems:"center", justifyContent:"center",flexDirection:  'column', gap: 2, mt: 2 }}>
                            <Box sx={{display: 'flex', alignItems:"center", justifyContent:"center",width:"70%" }}>
                                <ResultChart 
                                    technical={result.technicalScore}
                                    communication={result.communicationScore}
                                    teamwork={result.teamworkScore}
                                    logicalThinking={result.logicalThinkingScore}
                                    learningDesire={result.learningDesireScore}
                                    companyUnderstanding={result.companyUnderstandingScore}
                                />
                            </Box>
                        </Box>

                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                            興味の推移
                        </Typography>                        
                        <Box sx={{ display: 'flex', alignItems:"center", justifyContent:"center",flexDirection:  'column', gap: 2, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems:"center", justifyContent:"center",width:"70%"}}>
                                <InterestShiftChart {...interestShift} />
                            </Box>
                        </Box>
                        <Divider sx={{ my: 3 }} />
    
                        <Typography variant="subtitle1" fontWeight="bold">
                            面接情報
                        </Typography>
                        
                                
                                
                                                            
                        <Box sx={{ my: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <BuildIcon sx={{ mr: 1 }} />
                                <span>面接形式: {setting.interviewType}</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FitnessCenterIcon sx={{ mr: 1 }} />
                                <span>難易度: {setting.difficulty}</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessAlarmIcon sx={{ mr: 1 }} />
                                <span>面接時間: {setting.duration}</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Settings sx={{mr:1}}/>
                                <span>面接モード: {setting.interviewMode === 'voice' ? '音声' : 'チャット'}</span>
                            </Box>
                        </Box>
    
                        <Typography >
                            {company.name}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            履歴追加時間
                        </Typography>
                        <Typography >
                            {time}
                        </Typography>
                    </Box>
                </CardContent>
                
            </Card>
            <Stack direction="row" spacing={1} sx={{mt:1}}>                                
                    <Link href="/mailbox" passHref>
                        <Button variant="contained" >MailBoxへ</Button>
                    </Link>
                    <Link href="/" passHref>
                        <Button variant="contained" >ホームへ</Button>
                    </Link>
                    {isRankIn ||
                        <Button variant ="outlined" onClick={addRanking}>ランキングに追加 </Button>
                    }
            </Stack>
        </Box>
    );
}
