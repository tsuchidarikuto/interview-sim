import type { Metadata } from "next";

import "./globals.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from "@mui/material/styles"; 
import {theme} from '@/styles/theme';
import {Provider} from 'jotai';

import { AuthProvider } from '@/provider/AuthContext';




export const metadata: Metadata = {
  title: "InterviewSim",
  description: "面接シミュレーター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
    <head>
      <title>Interview Simulation</title>
      <meta property="og:title" content="title:URLプレビューテスト"/> 
      <meta property="og:description" content="description:URLプレビューテスト"/>
      <meta property="og:image" content="https://placehold.jp/d92733/ffffff/150x150.png?text=LINE%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E3%83%86%E3%82%B9%E3%83%88"/>

    </head>
    <body className="Paper_v2">
    <AuthProvider>
        <Provider>
          <ThemeProvider theme={theme}>          
            <Header title="InterviewSim" />              
              {children}                        
            <Footer/>          
          </ThemeProvider>
        </Provider>
        </AuthProvider>
    </body>
  </html>
  );
}
