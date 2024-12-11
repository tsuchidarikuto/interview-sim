'use client';
import {Container,Button,Typography} from '@mui/material';    
import Link from 'next/link';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom} from '@/atoms/state';
import {useState,useEffect} from 'react';
import { conversationTypes,questionTypes } from '@/types';


export default function Interview() {
    const [questions] = useAtom(questionsAtom);
    
    const [conversation,setConversation] =useState<conversationTypes[]>([])
    const [isSend,setIsSend]=useState<boolean>(false)
    const [questionIndex,setQuestionIndex]=useState<number>(0)
    const [isEnd,setIsEnd]=useState<boolean>(false)
    async function handleSubmit(message:string){
        setIsSend(true)
        
        setConversation((prev)=>[...prev,{role:'user',message:message}]);        

        if(questions && questionIndex +1 < questions.length){
            setConversation((prev)=>[...prev,{role:'system',message:questions[questionIndex+1]?.question}]);
            setQuestionIndex((prev)=>prev+1);
        }else if(questionIndex===questions.length){
            setConversation((prev)=>[...prev,{role:'system',message:'面接終了です。'}]);
            setIsEnd(true)
        }
        setIsSend(false)        

    }

    useEffect(()=>{
        if(questions){
            
            setConversation([{role:'system',message:questions[0]?.question}])
        }
    },[])


    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}} >       
        <MainContainer>
            <ChatContainer>       
                <MessageList>
                {conversation.map((item,index)=> 
                    <Message 
                        key={index} 
                        model={{
                            message: item.message,
                            sender: item.role,
                            position:'last',
                            direction: item.role==='user'?'outgoing':'incoming',
                        }}
                    />)}
                    
                </MessageList>
                {isSend ?
                <MessageInput  disabled placeholder="Sending Message" attachButton={false} />:
                <MessageInput placeholder="Type message here" attachButton={false} onSend={handleSubmit}/>
                }
                   
            </ChatContainer>
        </MainContainer>    
         {isEnd &&       
        <Link href='/result'>
            <Button variant="contained" size='small'>
                結果へ
            </Button>
        </Link>
        }
        </Container>
    );

}
