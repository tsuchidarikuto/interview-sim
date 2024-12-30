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
      <meta property="og:title" content="InterviewSim"/> 
      <meta property="og:description" content="面接をシミュレーションするよ"/>
      <meta property="og:image" content="/favicon.ico"/>

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
