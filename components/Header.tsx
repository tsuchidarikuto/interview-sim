'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button ,Box} from '@mui/material';
import { signOut } from 'firebase/auth';

import { AuthContext } from '@/provider/AuthContext';
import { auth } from '@/firebase';

import EmailIcon from '@mui/icons-material/Email';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useContext(AuthContext);
  const isLogin = !!user; 

  return (
    <AppBar position="static">
      <Toolbar>
        {isLogin ? (
          <Link href="/" passHref>
            <Typography variant="h6">
              {title}
            </Typography>
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
            <EmailIcon sx={{ cursor: 'pointer' }} />
          </Box>
        </Link>
        </>
        )}
      </Toolbar>
    </AppBar>
  );
}