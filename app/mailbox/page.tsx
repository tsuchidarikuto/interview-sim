'use client';
import React from 'react';
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Card,
    CardActions,
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
import { firestore } from '@/firebase';
import { HistoryTypes } from '@/types';
import {AuthContext} from '@/provider/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


export default function MailBox() {
    const [history, setHistory] = useState<HistoryTypes[]>([]);
    const [isFetching,setIsFetching] = useState<boolean>(true);
    const {user} = useContext(AuthContext);

    async function getHistory() {
        try {
            if (!user) {
                throw new Error('User is not found');
            }
            
            const q = query(
                collection(firestore, 'history'),
                where('uid','==',user.uid)
            );

            const snapShot = await getDocs(q);
            const interviewResultHistory = snapShot.docs.map(doc => {
                const data = doc.data();
                const interviewResult: any = { ...data, id: doc.id };
                return interviewResult;
            });
            interviewResultHistory.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            setHistory(interviewResultHistory);
            setIsFetching(false);
            
        } catch (e) {
            console.error('Error getting document:', e);
        }
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, minHeight: '80vh' }}>
            <Typography variant="h5"><strong>MailBox</strong></Typography>
            
            <Card variant="outlined">
                {isFetching ? (
                    <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}>
                                                <CircularProgress/>
                                </Box>      
                )
                :
                (
                <CardContent sx={{ p: 0,maxHeight: 600, overflowY: 'auto'}}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {history.map((item, index) => (
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
                                            <Box >
                                                <Chip
                                                    icon={item.isRead ? 
                                                        (item.result.isPass ? <CheckCircleIcon /> : <CancelIcon />) : 
                                                        <MailIcon />
                                                    }
                                                    label={item.isRead ?
                                                        (item.result.isPass ? 'Passed' : 'Failed'):
                                                        'New'
                                                    }
                                                    color={item.isRead ? 
                                                        (item.result.isPass ? 'success' : 'error') : 
                                                        'default'
                                                    }
                                                    variant={item.isRead ? 'filled' : 'outlined'}
                                                    
                                                />
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {item.company?.name?.[0] || '?'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" component="div">
                                                    {item.company?.name}
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
                )
                }
            
            </Card>
                           
                    <Link href="/" passHref>
                        <Button variant="contained" sx={{mt:3}}>ホームへ</Button>
                    </Link>
            
        </Box>
    );
}
