'use client';
import { FunctionComponent } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {Container,Button} from '@mui/material';    
import Link from 'next/link';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import { chatTheme } from "@/app/theme";

export default function Interview() {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}} >       
            
            <MainContainer>
                <ChatContainer style={{ backgroundColor: "#000000" }}>
                    <MessageList >
                        
                    </MessageList>
                    <MessageInput placeholder="メッセージを入力" />
                </ChatContainer>
            </MainContainer>
        <Link href='/result'>
            <Button variant="contained" size='small'>
                結果へ
            </Button>
        </Link>
        </Container>
    );

}
