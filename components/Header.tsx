'use client';
import React, { useContext, useEffect,useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box ,Badge} from '@mui/material';
import { signOut } from 'firebase/auth';

import { AuthContext } from '@/provider/AuthContext';
import { auth } from '@/firebase';

import {getHistory} from "@/utils/handleFirebase"
import { HistoryTypes } from '@/types';

import EmailIcon from '@mui/icons-material/Email';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useContext(AuthContext);
  const isLogin = !!user; 
  const [history, setHistory] = useState<HistoryTypes[]>([])

  const [unreadedCount,setUnreadedCount] = useState<number>(0)

  useEffect(() => {
    const countUnreaded = history.filter(item => !item.isRead).length;
    setUnreadedCount(countUnreaded);
  }, [history]);

  useEffect(() => {
          
          const fetchHistory = async () => {
            console.log(user)
              if (user) {
                  const result = await getHistory(user.uid);
                  if (result) {
                      setHistory(result.interviewResultHistory);                  
                  }
              }
          };
          fetchHistory();
      }, [user]);

  return (
    <AppBar position="sticky">
      <Toolbar >
        {isLogin ? (
          
          <Link href="/" passHref>
            <Box sx={{display:"flex",alignItems:"center"}}>
            <Typography variant="h6">
              {title}
            </Typography>
            <Box sx={{ backgroundImage: 'url(/avatar_logo.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',height:40,width:50}}/>
          </Box>
          </Link>):
        (
          <Typography variant="h6">
            {title} 
          </Typography>
        )}

        <div style={{ flexGrow: 1 }} />
        {isLogin && (
          <>
            <Typography variant='body2' sx= {{mt:1}}>{user.email}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Button onClick={() => signOut(auth)}>
              <LogoutOutlinedIcon sx={{  cursor: 'pointer' }} color = "secondary" />
            </Button>        
            </Box>    
          </>
        )}
        {isLogin && (
          <>
        
        <Link href="/mailbox" passHref>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Badge color="error" badgeContent={unreadedCount}>
              <EmailIcon sx={{ cursor: 'pointer' }} />
            </Badge>
          </Box>
        </Link>
        </>
        )}
      </Toolbar>
    </AppBar>
  );
}