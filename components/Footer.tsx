'use client';
import React from 'react';
import { Box } from '@mui/material';





export default function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        py: 2,
      }}
    >
      © 2024 Tsuchida Rikuto
    </Box>
  );
}

