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
      <meta
        name="description"
        content="面接練習用アプリ"
      />
    </head>
    <body className="container mx-auto p-4">
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
