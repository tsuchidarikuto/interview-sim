'use client';
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';




export default function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        backgroundColor: 'default',
        py: 2,
      }}
    >
      © 2023 Your Company
    </Box>
  );
}

