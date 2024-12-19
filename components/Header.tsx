'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button ,Stack} from '@mui/material';
import { signOut } from 'firebase/auth';

import { AuthContext } from '@/provider/AuthContext';
import { auth } from '@/firebase';

import HistoryIcon from '@mui/icons-material/History';
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
        <Link href="/" passHref>
          <Typography variant="h6">
            {title}
          </Typography>
        </Link>

        <div style={{ flexGrow: 1 }} />
        {isLogin && (//あとでなおす
          <>
            <Typography variant='body1'>{user.email}</Typography>
            
            <Button onClick={() => signOut(auth)}>
              <LogoutOutlinedIcon sx={{  cursor: 'pointer' }} color = "secondary" />
            </Button>
            
          </>
        )}
        <Link href="/history">
          <HistoryIcon sx={{ cursor: 'pointer'  }} />
        </Link>
      </Toolbar>
    </AppBar>
  );
}