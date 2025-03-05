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
    CircularProgress
} from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import { HistoryTypes } from '@/types';
import { AuthContext } from '@/provider/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';
import { createClient } from '@/utils/supabase/client';
import { SupabaseDatabase } from '@/utils/supabase/database';
import {getMailboxData} from '@/utils/getMailboxData';
import { MailContentsTypes } from '@/types';

export default function MailBox() {       
    const [mailContents, setMailContents] = useState<MailContentsTypes[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [user,]= useAtom(userAtom);
    const {push } = useRouter()

    useEffect(() => {
        if (!user) {
            push('/login');
            return;
        }
        const fetchHistory = async () => {
            const result = await getMailboxData(user.uid);
            if (result) {
                setMailContents(result);
                setIsFetching(false);
            }
        };
        fetchHistory();
    }, [user]);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, minHeight: '80vh' }}>
            <Box sx={{ my: 2 }}>
                <Typography variant="h4"><strong>MailBox</strong></Typography>                
                <Typography variant="subtitle1" color="text.secondary">
                    新着メッセージと履歴をチェックしてみましょう
                </Typography>
            </Box>
            
            
            <Card variant="outlined" sx={{height:"60vh"}}>
                {isFetching ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : history.length === 0 ? (
                    <Box sx={{ height: '60vh', display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h6" color="text.secondary">
                            新着メールはありません
                        </Typography>
                    </Box>
                ) : (
                    <CardContent sx={{ p: 0, maxHeight: 600, overflowY: 'auto' }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {mailContents.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ListItemButton
                                        component={Link}
                                        href={`/mailbox/${item.id}`}
                                        sx={{
                                            bgcolor: item.isRead ? 'transparent' : 'action.hover',
                                            '&:hover': {
                                                bgcolor: 'action.selected',
                                            },
                                        }}
                                    >
                                        <ListItem
                                            secondaryAction={
                                                <Box>
                                                    <Chip
                                                        icon={item.isRead ?
                                                            (item.isPass ? <CheckCircleIcon /> : <CancelIcon />) :
                                                            <MailIcon />
                                                        }
                                                        label={item.isRead ?
                                                            (item.isPass ? 'Passed' : 'Failed') :
                                                            'New'
                                                        }
                                                        color={item.isRead ?
                                                            (item.isPass ? 'success' : 'error') :
                                                            'default'
                                                        }
                                                        variant={item.isRead ? 'filled' : 'outlined'}
                                                    />
                                                </Box>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {item.companyName?.[0] || '?'}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" component="div">
                                                        {item.companyName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span" color="text.secondary">
                                                            {item.time}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    </ListItemButton>
                                    {index < history.length - 1 && (
                                        <Divider variant="inset" component="li" />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                )}
            </Card>
                            
            <Link href="/" passHref>
                <Button variant="contained" sx={{ mt: 3 }}>ホームへ</Button>
            </Link>
            
        </Box>
    );
}
