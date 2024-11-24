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
      main: '#000000',
    },
  },
});

const CustomCard = styled(Card)({
  height: '100%', // Set your desired height here
  flexGrow: 1,
});

const chatTheme = {
  // 基本的な背景色と文字色
  backgroundColor: "#000000",
  textColor: "#ffffff",

  // メッセージ関連
  incomingMessageBackground: "#333333",
  incomingMessageText: "#ffffff",
  outgoingMessageBackground: "#1a1a1a",
  outgoingMessageText: "#ffffff",

  // 入力欄
  inputBackground: "#1a1a1a",
  inputText: "#ffffff",
  inputPlaceholder: "#808080",

  // セパレータやボーダー
  separatorColor: "#404040",
  borderColor: "#404040",

  // スクロールバー
  scrollbarThumb: "#404040",
  scrollbarTrack: "#1a1a1a",

  // その他のUI要素
  timestampText: "#808080",
  typingIndicatorBackground: "#333333",
  typingIndicatorForeground: "#ffffff",
  
  // ホバー状態
  messageHoverBackground: "#262626",
  
  // アクティブ状態
  activeBackground: "#262626",
  activeBorder: "#404040",
};

export { theme, CustomCard, chatTheme };