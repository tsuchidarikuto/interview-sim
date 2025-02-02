'use client';
import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Card,
    CardContent,
    Avatar,
    Divider,
    Box,
    Chip,
    Typography,
    Button,
    CircularProgress,
    CardHeader,    
} from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import { HistoryTypes } from '@/types';
import { AuthContext } from '@/provider/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getHistory } from "@/utils/handleFirebase"
import { useRouter } from "next/navigation";

export default function MailboxAbstract() {
    const [history, setHistory] = useState<HistoryTypes[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const { user } = useContext(AuthContext);
    const {push } = useRouter()
    useEffect(() => {
        if (!user) {            
            return;
        }
        const fetchHistory = async () => {
            const result = await getHistory(user.uid);
            if (result) {
                setHistory(result.interviewResultHistory);
                setIsFetching(result.isFetching);
            }
        };
        fetchHistory();
    }, [user]);

    return (
        
            <>
            
            <Card variant="outlined" sx={{ p: 1, pb: 0 ,height:355}}>
                <CardHeader 
                    title="MailBox" 
                    subheader="これまでの履歴を確認できます。" 
                    sx={{ pb: 1 }}
                />
                <CardContent sx={{ py: 0 }}>
            
                {isFetching ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" ,height:260}}>
                        <CircularProgress />
                    </Box>
                ) : history.length === 0 ? (
                    <Card variant = "outlined" sx={{ display: "flex", alignItems: "center", justifyContent: "center" ,height:195}}>
                        <Typography variant="h6" color="text.secondary">
                            新着メールはありません
                        </Typography>
                    </Card>
                ) : (
                    <Card variant="outlined" sx={{ height: 195 }}>
                        {history.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Box
                                    component={Link}
                                    href={`/mailbox/${item.id}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        bgcolor: item.isRead ? 'transparent' : 'action.hover',
                                        '&:hover': {
                                            bgcolor: 'action.selected',
                                            textDecoration: 'none',
                                        },
                                    }}
                                >                                    
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" component="div">
                                            {item.company?.name || '未記入'}
                                        </Typography>
                                        <Typography variant="body2" component="div" color="text.secondary">
                                            {item.time}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        icon={
                                            item.isRead
                                                ? item.result.isPass
                                                    ? <CheckCircleIcon />
                                                    : <CancelIcon />
                                                : <MailIcon />
                                        }
                                        label={
                                            item.isRead
                                                ? item.result.isPass
                                                    ? 'Passed'
                                                    : 'Failed'
                                                : 'New'
                                        }
                                        color={
                                            item.isRead
                                                ? item.result.isPass
                                                    ? 'success'
                                                    : 'error'
                                                : 'default'
                                        }
                                        variant={item.isRead ? 'filled' : 'outlined'}
                                    />
                                </Box>
                                {index < history.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </Card>
                    
                
                )}
                <Link href="/mailbox" passHref>
                    <Button variant="outlined" sx={{ mt: 2 }}>もっと見る</Button>
                </Link>
                </CardContent>
                
            </Card>
                            

            </>
    );
}
