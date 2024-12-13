'use client';
import {Container,Button,Typography} from '@mui/material';    
import Link from 'next/link';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom,conversationAtom} from '@/atoms/state';
import {useState,useEffect} from 'react';
import { conversationTypes,questionTypes } from '@/types';
import { useRouter } from 'next/navigation';
import  analyzeInterviewResult  from '@/utils/analyzeInterviewResult';

export default function Interview() {
    const {push} = useRouter();
    const [questions] = useAtom(questionsAtom);
    
    const [conversation,setConversation] =useState<conversationTypes[]>([])
    const [isSend,setIsSend]=useState<boolean>(false)
    const [questionIndex,setQuestionIndex]=useState<number>(0)
    const [isEnd,setIsEnd]=useState<boolean>(false)
    const [,setConversationResult] = useAtom(conversationAtom);
    
    async function handleSubmit(message:string){
        setIsSend(true)
        
        setConversation((prev)=>[...prev,{role:'user',message:message}]);        
        console.log(questionIndex);
        if(questions && questionIndex  < questions.length){            
            setConversation((prev)=>[...prev,{role:'system',message:questions[questionIndex]?.question}]);
            
        }else if(questionIndex>=questions.length){
            setConversation((prev)=>[...prev,{role:'system',message:'面接終了です。'}]);
            setIsEnd(true)
        }
        setQuestionIndex((prev)=>prev+1);
        setIsSend(false)        

    }
    
    function handleClickResult(){
        const result = analyzeInterviewResult(JSON.stringify(conversation));
        push('/result')
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
                {isSend||isEnd ?
                <MessageInput  disabled placeholder="Sending Message" attachButton={false} />:
                <MessageInput placeholder="Type message here" attachButton={false} onSend={handleSubmit}/>
                }
                   
            </ChatContainer>
        </MainContainer>    
         {isEnd &&               
            <Button variant="contained" size='small' onClick={handleClickResult}>
                結果へ
            </Button>        
        }
        </Container>
    );

}
