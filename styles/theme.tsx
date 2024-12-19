'use client';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});

const CustomCard = styled(Card)({
  height: '100%', // Set your desired height here
  flexGrow: 1,
  '&:hover': {
    backgroundColor: '#F5F5F3', // Change background color on hover
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
  },
});


export { theme, CustomCard, };