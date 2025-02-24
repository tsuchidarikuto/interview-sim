'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Box, Badge, IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { HistoryTypes } from '@/types';
import EmailIcon from '@mui/icons-material/Email';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { createClient } from '@/utils/supabase/client';
import FeedBackDialog from './FeedbackDialog';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';

export default function Header() {  
    const supabase = createClient();
    const {push} = useRouter();
    const [user,] = useAtom(userAtom);

    

    const doLogout = async () => {
        try {
            await supabase.auth.signOut();
            console.log('Logout successful');
            push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    

    return (
        <AppBar position="sticky">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>        
                <Box sx={{ display: 'flex', alignItems: 'center' }}>          
                    <Link href="/" passHref>
                        <Box
                            sx={{
                                backgroundImage: 'url(/titleLogo.svg)',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                height: { xs: 32, sm: 50 },
                                width: { xs: 110, sm: 160 },
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        こんにちは{user?.name}さん
                    </Typography>            
                    <IconButton color="inherit" onClick={doLogout}>
                        <LogoutOutlinedIcon fontSize="medium" />
                    </IconButton>
                    
                    <Link href="/ranking" passHref>
                        <IconButton color="inherit">
                            <EmojiEventsIcon fontSize="medium" />
                        </IconButton>
                    </Link>
                    <FeedBackDialog/>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
