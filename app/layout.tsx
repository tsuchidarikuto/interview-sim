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
  description: "面接をシミュレートするよ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
    <head>    
    <meta property="og:image" content="/og-image.jpg"/>
    </head>
    <body className="Paper_v2" style={{height:"100vH"}}>
    <AuthProvider>
        <Provider>
          <ThemeProvider theme={theme}>          
            <Header title="" />              
              {children}                        
            <Footer/>          
          </ThemeProvider>
        </Provider>
        </AuthProvider>
    </body>
  </html>
  );
}
