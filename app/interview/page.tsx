'use client';
import {Container,Button} from '@mui/material';    
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom,interviewResultAtom} from '@/atoms/state';
import {useState,useEffect} from 'react';
import { conversationTypes,interviewResultTypes } from '@/types';
import { useRouter } from 'next/navigation';
import  analyzeInterviewResult  from '@/utils/analyzeInterviewResult';
import "@/styles/chat.scss"; 

export default function Interview() {
    const {push} = useRouter();
    const [questions] = useAtom(questionsAtom);
    
    const [conversation,setConversation] =useState<conversationTypes[]>([])
    const [isSend,setIsSend]=useState<boolean>(false)
    const [questionIndex,setQuestionIndex]=useState<number>(0)
    const [isEnd,setIsEnd]=useState<boolean>(false)
    const [,setInterviewResult]=useAtom(interviewResultAtom);
    
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

    async function handleClickResult() {
        try {
            const result:interviewResultTypes|undefined = await analyzeInterviewResult(JSON.stringify(conversation));
            console.log(result);
            if (result) {
                setInterviewResult(result);
                push('/result');
            } else {
                console.error('Result is undefined');
            }
        } catch (e) {
            console.error('Error during preparation:', e);
        }
    }

    useEffect(()=>{
        if(questions){
            
            setConversation([{role:'system',message:questions[0]?.question}])
        }
    },[])


    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 4,height:'80vh'}} >       
        <MainContainer className="my-chat-container">
            <ChatContainer className="my-chat-container">       
                <MessageList className="my-chat-container">
                {conversation.map((item,index)=> 
                    <Message className="my-chat-container"
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
