'use client';
import React from 'react';
import { createTheme } from '@mui/material/styles';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#000000',
      },
    },
  
  });

const CustomCard = styled(Card)({
    height: '100%', // Set your desired height here
    flexGrow: 1,

});

export  {theme,CustomCard};