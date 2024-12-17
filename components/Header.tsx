import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/" passHref>
          <Typography variant="h6" >
            {title}
          </Typography>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link href="/history" >
          <HistoryIcon sx={{ ml: 'auto', cursor: 'pointer' }} />
        </Link>
      </Toolbar>
    </AppBar>
  );
}