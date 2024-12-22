'use client';
import {Container,Button,Box,Backdrop, Typography} from '@mui/material';    
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Avatar } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom,interviewResultAtom} from '@/atoms/state';
import {useState,useEffect,useContext} from 'react';
import { conversationTypes,interviewResultTypes } from '@/types';
import { useRouter } from 'next/navigation';
import  analyzeInterviewResult  from '@/utils/analyzeInterviewResult';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { addToHistory } from '@/utils/addToHistory';
import {AuthContext} from '@/provider/AuthContext';

import "@/styles/chat.scss"; 

export default function Interview() {
    const {push} = useRouter();
    const {user} = useContext(AuthContext);

    const [questions] = useAtom(questionsAtom);
    
    const [conversation,setConversation] =useState<conversationTypes[]>([])
    const [isSend,setIsSend]=useState<boolean>(false)
    const [questionIndex,setQuestionIndex]=useState<number>(0)
    const [isEnd,setIsEnd]=useState<boolean>(false)
    const [,setInterviewResult]=useAtom(interviewResultAtom);
    const [isAnalyzing,setIsAnalyzing]=useState<boolean>(false)
    const [progress,setProgress]=useState<number>(0)    

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
            if(!user){
                throw new Error('User is not found');
            }
            setIsAnalyzing(true);
            setProgress(10);
            const result:interviewResultTypes|undefined = await analyzeInterviewResult(JSON.stringify(conversation),setProgress,user.uid);
            
            if (result) {
                setInterviewResult(result);
                setProgress(80);
                addToHistory(result,user.uid);
                setProgress(100);
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
        <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '80vh' }}>
        
        <MainContainer >
            <ChatContainer>       
                <MessageList >
                {conversation.map((item,index)=> 
                    <Message 
                        key={index} 
                        model={{
                            message: item.message,
                            sender: item.role,
                            position:'single',
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
        <Box sx={{mt:2}}>
         {isEnd &&               
            <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            { isAnalyzing?
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width:'100%',margin:5}}>
                <Typography>分析中...</Typography>
                <LinearProgressWithLabel value={progress} />
            </Box>:        
            <Button variant="contained" size='large' onClick={handleClickResult}>
                分析開始
            </Button>
            }
        </Backdrop>       
        }
        </Box>
        </Container>
    );

}
