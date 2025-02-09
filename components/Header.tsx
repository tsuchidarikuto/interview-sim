'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Box, Badge, IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { AuthContext } from '@/provider/AuthContext';
import { auth, firestore } from '@/firebase';
import { HistoryTypes } from '@/types';
import EmailIcon from '@mui/icons-material/Email';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import FeedBackDialog from './FeedbackDialog';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useContext(AuthContext);
  const isLogin = !!user;
  const [history, setHistory] = useState<HistoryTypes[]>([]);
  const [unreadedCount, setUnreadedCount] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setUnreadedCount(0);
      setHistory([]);
      return;
    }
    const q = query(collection(firestore, 'history'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newHistory = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HistoryTypes, 'id'>),
      }));
      setHistory(newHistory);
    }, (error) => {
      console.error('Error fetching history: ', error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setUnreadedCount(history.filter((item) => !item.isRead).length);
  }, [history]);

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLogin ? (
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
          ) : (
            <Typography variant="h6" color="inherit">
              <strong>{title}</strong>
            </Typography>
          )}
        </Box>

        {isLogin && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" color="inherit" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.email}
            </Typography>            
            <IconButton onClick={() => signOut(auth)} color="inherit">
              <LogoutOutlinedIcon fontSize="medium" />
            </IconButton>
            <Link href="/mailbox" passHref>
              <IconButton color="inherit">
                <Badge badgeContent={unreadedCount} color="error">
                  <EmailIcon fontSize="medium" />
                </Badge>
              </IconButton>
            </Link>
            <Link href="/ranking" passHref>
              <IconButton color="inherit">
                <EmojiEventsIcon fontSize="medium" />
              </IconButton>
            </Link>
            <FeedBackDialog/>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
