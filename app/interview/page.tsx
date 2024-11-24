'use client';
import { FunctionComponent } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {Container,Box} from '@mui/material';    
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";

export default function Interview() {
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}}>       
            
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        
                    </MessageList>
                    <MessageInput placeholder="メッセージを入力" />
                </ChatContainer>
            </MainContainer>
            
        </Container>
    );

}
