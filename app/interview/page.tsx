'use client';
import {
    Box,
    TextField,
    Paper,
    Typography,
    Avatar,
    Stack,
    Container,
    Backdrop,
    Button,
    IconButton
} from "@mui/material";  
import {useAtom} from 'jotai';
import {questionsAtom, interviewResultAtom, resumeAtom, companyAtom, settingAtom} from '@/atoms/state';
import {useState, useEffect, useContext, useRef} from 'react';
import {ConversationTypes, interviewResultTypes} from '@/types';
import {useRouter} from 'next/navigation';
import analyzeInterviewResult from '@/utils/analyzeInterviewResult';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import {addToHistory} from '@/utils/addToHistory';
import {AuthContext} from '@/provider/AuthContext';
import checkUserInput from '@/utils/checkUserInput';
import {styled} from "@mui/system";
import SendIcon from '@mui/icons-material/Send';
import "@/styles/chat.scss"; 

export default function Interview() {
  const {push} = useRouter();
  const {user} = useContext(AuthContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [questions] = useAtom(questionsAtom);
  const [conversation,setConversation] = useState<ConversationTypes[]>([]);
  const [isSend,setIsSend] = useState<boolean>(false);
  const [questionIndex,setQuestionIndex] = useState<number>(0);
  const [isEnd,setIsEnd] = useState<boolean>(false);    
  const [isAnalyzing,setIsAnalyzing] = useState<boolean>(false);
  const [progress,setProgress] = useState<number>(0);
  const [currentConversation,setCurrentConversation] = useState<ConversationTypes[]>([]);
  const [isSubjectEnd, setIsSubjectEnd] = useState<boolean>(false);
  const [interestShift,setInterestShift] = useState<number[]>([]);
  const [isInjected,setIsInjected] = useState<boolean>(false);
  const [,setInterviewResult] = useAtom(interviewResultAtom);
  const [company] = useAtom(companyAtom);
  const [resume] = useAtom(resumeAtom);
  const [setting] = useAtom(settingAtom);
  const [userMessage, setUserMessage] = useState<string>("");
  const [isLastSubject,setIsLastSubject ]= useState<boolean> (false);

  const MessageBubble = styled(Box)<{ role: string }>(({ role }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    flexDirection: role === "user" ? "row-reverse" : "row",
  }));
    
  const MessageContent = styled(Paper)<{ role: string }>(({ role }) => ({
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "70%",
    marginLeft: role === "user" ? 0 : "12px",
    marginRight: role === "user" ? "12px" : 0,
    backgroundColor: role === "user" ? "#222222" : "#f5f5f5",
    color: role === "user" ? "#fff" : "#000",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
    },
  }));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEnd && !isSend) {
      inputRef.current?.focus();//オートフォーカス
    }
  }, [isEnd, isSend]);

  useEffect(()=>{
    if(questions){
      setCurrentConversation([{role:'system',message:questions[0]?.question,interest:3}]);//最初の質問
    }
  },[]);

  useEffect(() => {
    if(isSubjectEnd){
      setConversation((prev)=>[...prev, ...currentConversation]);
      setCurrentConversation([]);
      setQuestionIndex((prev)=>prev+1);
      if(isLastSubject){
        setConversation((prev) => [...prev, {role:'system',message:'面接終了です。',interest:3}]);
        setIsEnd(true);
      }

      if (questionIndex + 1 < questions.length) {
        if(questionIndex+1==questions.length-1){
          setIsLastSubject(true);
        }
        setCurrentConversation([
          { 
            role: 'system', 
            message: questions[questionIndex + 1].question,
            interest: 3
          },
        ]);
      }
      setIsSubjectEnd(false);
    } 
  }, [isSubjectEnd]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  async function handleSubmit(message: string){
    setIsSend(true);
    const updatedConversation = [...currentConversation, {role:'user', message}];
    setCurrentConversation(updatedConversation);
  
    if (questions && questionIndex < questions.length) {
      const checkedResponse = await checkUserInput(updatedConversation, setting);
      setIsInjected(checkedResponse.isInjected);
      setIsSubjectEnd(checkedResponse.isSubjectEnd);
      setInterestShift((prev)=>[...prev,checkedResponse.interest])
      setCurrentConversation((prev) => [...prev, {role:'system', message:checkedResponse.response, interest:checkedResponse.interest}]);
    } else if (questionIndex >= questions.length) {
      
    }
    setUserMessage("");
    setIsSend(false);
  }

  async function handleClickResult() {
    try {
      if(!user) throw new Error('User is not found');
      setIsAnalyzing(true);
      setProgress(10);
      if (!company) throw new Error('Company information is not found');
      if (!resume) throw new Error('Resume information is not found');
      if (!setting) throw new Error('Setting information is not found');
            
      const result: interviewResultTypes|undefined = await analyzeInterviewResult(JSON.stringify(conversation), setProgress, company, resume, setting);
            
      if (result) {
        setInterviewResult(result);
        setProgress(80);
        addToHistory(result, company, resume, setting, conversation, interestShift,user.uid);
        setProgress(100);
        push('/mailbox');
      } 
    } catch (e) {
      console.error('Error during preparation:', e);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '80vh' }}>
      <Container sx={{height:"90%" ,flex: 1,overflow: "auto",padding: "20px",display: "flex", flexDirection: "column",gap: "16px",}}>      
          {[...conversation, ...currentConversation].map((item,index) => (
            <MessageBubble key={index} role={item.role}>
              {item.role=== "system" &&
              <Avatar
                src={`/avatar_${item.interest}.svg`}
                alt={item.role}
                sx={{width: 100,height: 100}}
              />
                }
              <MessageContent  role={item.role} variant="outlined">
                <Typography variant="body1" component="div">
                  {item.message}
                </Typography>
              </MessageContent>
            </MessageBubble>
          ))}
        <div ref={messagesEndRef}></div>
        </Container>
      <Box sx={{display:"flex"}}>
      <TextField
        inputRef={inputRef}
        fullWidth
        disabled={isEnd || isSend}
        value={userMessage}              
        onChange={(event:React.ChangeEvent<HTMLInputElement>)=>setUserMessage(event.target.value)}
        placeholder="解答を入力"              
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && userMessage) {
            event.preventDefault();
            handleSubmit(userMessage);
          }
        }}
          />
          <IconButton
              color="primary"
              disabled={isEnd || isSend || !userMessage}
              onClick={()=>handleSubmit(userMessage)}
          >
              <SendIcon />
          </IconButton>
        </Box>
          
          
          
      <Box sx={{mt:2}}>
        {isEnd &&
        <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          {isAnalyzing ?

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width:'100%', margin:10}}>
              <Typography>分析中...</Typography>
              <LinearProgressWithLabel value={progress} />
            </Box>
            :
            <Button variant="contained" size='large' onClick={handleClickResult}>
              分析開始
            </Button>
          }
        </Backdrop>}
      </Box>
    </Container>
  );
}
