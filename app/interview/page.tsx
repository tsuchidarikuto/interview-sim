'use client';
import {Container,Button,Typography} from '@mui/material';    
import Link from 'next/link';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom} from '@/atoms/state';
import {questionTypes} from '@/types';

export default function Interview() {
    const [questions] = useAtom(questionsAtom);
    if(!questions||questions.length===0){
        return <div>質問がありません</div>
    }

    
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}} >       
            
            
        <Link href='/result'>
            <Button variant="contained" size='small'>
                結果へ
            </Button>
        </Link>
        </Container>
    );

}
