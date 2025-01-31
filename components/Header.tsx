'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { signOut } from 'firebase/auth';
import { AuthContext } from '@/provider/AuthContext';
import { auth, firestore } from '@/firebase';
import { HistoryTypes } from '@/types';
import EmailIcon from '@mui/icons-material/Email';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

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
      <Toolbar>
        {isLogin ? (
          <Link href="/" passHref>
            <Box
              sx={{
                backgroundImage: 'url(/titleLogo.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: { xs: 28, sm: 50 },
                width: { xs: 100, sm: 150 },
                marginRight: 'auto',
              }}
            />
          </Link>
        ) : (
          <Typography variant="h6">
            <strong>{title}</strong>
          </Typography>
        )}

        <div style={{ flexGrow: 1 }} />
        {isLogin && (
          <>
            <Typography
              variant="body2"
              sx={{ mt: { xs: 1, sm: 0 }, fontSize: { xs: '0.75rem', sm: '1rem' } }}
            >
              {user.email}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                mx: { xs: 0, sm: 1 },
              }}
            >
              <Button onClick={() => signOut(auth)}>
                <LogoutOutlinedIcon
                  sx={{ cursor: 'pointer', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                  color="secondary"
                />
              </Button>
            </Box>
            <Link href="/mailbox" passHref>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  mx: { xs: 0, sm: 1 },
                }}
              >
                <Badge color="error" badgeContent={unreadedCount}>
                  <EmailIcon sx={{ cursor: 'pointer', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </Badge>
              </Box>
            </Link>
            <Link href="/ranking" passHref>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  mx: { xs: 0, sm: 1 },
                }}
              >
                <EmojiEventsIcon
                  sx={{ cursor: 'pointer', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                />
              </Box>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
