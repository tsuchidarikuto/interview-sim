"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { AuthContext } from '@/provider/AuthContext';
import { HistoryTypes } from '@/types';
import Link from 'next/link';
import ResultChart from '@/components/resultChart';

import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Chip,
    Divider,
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import BuildIcon from '@mui/icons-material/Build';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export default function Page() {
    const { user } = useContext(AuthContext);
    const { resultId } = useParams();
    const [selectedHistory, setSelectedHistory] = useState<HistoryTypes>();

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!user) return;
                const rid = Array.isArray(resultId) ? resultId[0] : resultId;
                if (!rid) return;
                const docRef = doc(firestore, 'history', rid);
                const snapShot = await getDoc(docRef);
                const data = snapShot.data();
                if (!data) return;
                await updateDoc(docRef, { isRead: true });
                setSelectedHistory(data as HistoryTypes);
            } catch (error) {
                console.log(error);
            }
        };
        getResult();
    }, [resultId, user]);

    if (!selectedHistory) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const { result, company, resume, setting, time } = selectedHistory;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card>
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
                            label={result.isPass ? 'Passed' : 'Not Passed'}
                            color={result.isPass ? 'success' : 'error'}
                        />
                    }
                />
                <CardContent>
                    <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {resume.name} 様
                        </Typography>
    
                        <Typography >
                            この度は{company.name}の{company.position}職の選考にご応募いただき、
                            誠にありがとうございます。
                        </Typography>
                        <br/>                           
                        <Typography variant="subtitle1" fontWeight="bold">
                            面接結果
                        </Typography>
                        <Typography sx={{ whiteSpace: 'pre-line' }}>
                            {result.isPass 
                                ? "この度は、選考にご参加いただき、誠にありがとうございました。\n\n" +
                                  "厳正なる選考の結果、貴殿の能力とご経験が弊社の求める人物像と合致すると判断いたしましたので、内定をご通知させていただきます。"
                                : "この度は、選考にご参加いただき、誠にありがとうございました。\n\n" +
                                  "慎重に選考を重ねました結果、誠に残念ながら、今回は貴意に沿いかねる結果となりました。\n\n" +
                                  "貴殿の今後のご活躍を心よりお祈り申し上げます。"}
                        </Typography>
    
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                            フィードバック
                        </Typography>
                        <br/>
                        <Typography >
                            <strong>評価できる点:</strong> <br/>
                            {
                                result.feedback.positive.length!=0 ?
                                (result.feedback.positive):
                                "特になし"
                            }
                        </Typography>
                        <br/>
                        <Typography >
                            <strong>改善を期待する点:</strong> <br/>
                            {result.feedback.negative}
                        </Typography>
    
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                            評価詳細
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <ResultChart {...result.score} />
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
                            <Box sx={{ display: 'flex', alignItems: 'center',mb:1}}>
                                <FitnessCenterIcon sx={{ mr: 1 }} />
                                <span>難易度: {setting.difficulty}</span>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessAlarmIcon sx={{ mr: 1 }} />
                                <span>面接時間: {setting.duration}</span>
                            </Box>
                        </Box>
    
                        <Typography >
                            人事部   {company.name}
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
            <Box sx={{mt:3}}>
            <Link href="/mailbox" passHref>
                        <Button variant="contained" >MailBoxへ</Button>
                    </Link>
                    <Link href="/" passHref>
                        <Button variant="contained" sx={{ml:2}}>ホームへ</Button>
                    </Link>
            </Box>
        </Box>
    );
}
