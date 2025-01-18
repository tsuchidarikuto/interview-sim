'use client';
import {Container,Button,Box,Backdrop, Typography} from '@mui/material';    
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from "@chatscope/chat-ui-kit-react";
import {useAtom} from 'jotai';
import {questionsAtom,interviewResultAtom,resumeAtom,companyAtom,settingAtom} from '@/atoms/state';
import {useState,useEffect,useContext} from 'react';
import { ConversationTypes,interviewResultTypes } from '@/types';
import { useRouter } from 'next/navigation';
import  analyzeInterviewResult  from '@/utils/analyzeInterviewResult';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { addToHistory } from '@/utils/addToHistory';
import {AuthContext} from '@/provider/AuthContext';
import checkUserInput from '@/utils/checkUserInput';

import "@/styles/chat.scss"; 

export default function Interview() {
    const {push} = useRouter();
    const {user} = useContext(AuthContext);

    const [questions] = useAtom(questionsAtom);
    
    const [conversation,setConversation] =useState<ConversationTypes[]>([])
    const [isSend,setIsSend]=useState<boolean>(false)
    const [questionIndex,setQuestionIndex]=useState<number>(1)
    const [isEnd,setIsEnd]=useState<boolean>(false)    
    const [isAnalyzing,setIsAnalyzing]=useState<boolean>(false)
    const [progress,setProgress]=useState<number>(0)
    
    const [currentConversation,setCurrentConversation] = useState<ConversationTypes[]>([]);
    const [isSubjectEnd, setIsSubjectEnd] =useState<boolean>(false);
    const [interest,setInterest] = useState<number[]>([]);
    const [isInjected,setIsInjected] = useState<boolean>(false);
    const [isContinue,setIscontinue] = useState<boolean>(false);

    const [,setInterviewResult]=useAtom(interviewResultAtom);
    const [company,]=useAtom(companyAtom);
    const [resume,]=useAtom(resumeAtom);
    const [setting,]= useAtom(settingAtom);


    async function handleSubmit(message:string){
        setIsSend(true)
        
        setCurrentConversation((prev)=>[...prev,{role:'user',message:message}]);                
        if(questions && questionIndex  < questions.length){            
            const checkedResponse = await checkUserInput(currentConversation,setting);
            //todo:入力チェック後の処理を書く
            
        }else if(questionIndex>=questions.length){
            setConversation((prev)=>[...prev,{role:'system',message:'面接終了です。'}]);
            setIsEnd(true)
        }
        if(isSubjectEnd==true){
            setConversation((prev)=>[...prev, ...currentConversation]);
            setCurrentConversation([]);
            setQuestionIndex((prev)=>prev+1);
            setIsSubjectEnd(false);
        } 
        setIsSend(false)      

    }

    async function handleClickResult() {
        try {
            if(!user){
                throw new Error('User is not found');
            }
            setIsAnalyzing(true);
            setProgress(10);
            if (!company) {
                throw new Error('Company information is not found');
            }
            if (!resume) {
                throw new Error('Resume information is not found');
            }
            if (!setting) {
                throw new Error('Setting information is not found');
            }
            
            const result:interviewResultTypes|undefined = await analyzeInterviewResult(JSON.stringify(conversation),setProgress,company,resume,setting);
            
            if (result) {
                setInterviewResult(result);
                setProgress(80);
                addToHistory(result, company, resume, setting, conversation, user.uid);
                setProgress(100);
                push('/mailbox');
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width:'100%',margin:10}}>
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
