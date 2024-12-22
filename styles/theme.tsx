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
      main: '#444444', // Orange color
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});



export { theme };