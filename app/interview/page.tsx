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
    IconButton,

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
import Link from 'next/link';

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
  const [conversationCount,setConversationCount]=useState<number>(0);

  const conversationLimit = setting?.difficulty === '激ムズ' ? 5 : setting?.difficulty === '難しい' ? 3 : setting?.difficulty === '普通' ? 2 : 1;

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
      setConversation((prev)=>[...prev, ...currentConversation]);//全体の会話履歴に保存
      setCurrentConversation([]);//現在の会話を書記か
      setConversationCount(0);//会話数をリセット
      setQuestionIndex((prev)=>prev+1);//質問リストを進める

      if(isLastSubject){        
        setIsEnd(true);//最後の話題だったら面接終了フラグを立てる
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
    
    const isConversationLimitReached = (conversationCount+1 === conversationLimit);
  
    if (questions ) {
      const checkedResponse = await checkUserInput(updatedConversation, setting,isLastSubject,isConversationLimitReached);
      setIsInjected(checkedResponse.isInjected);
      setIsSubjectEnd(checkedResponse.isSubjectEnd);
      setInterestShift((prev)=>[...prev,checkedResponse.interest])
      setCurrentConversation((prev) => [...prev, {role:'system', message:checkedResponse.response, interest:checkedResponse.interest}]);
    }
    setConversationCount((prev)=>prev+1);
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

  if(isInjected){
    return (
      <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",width:"100%", backgroundColor: 'black'}}>
        <Box sx={{display:"flex",alignItems:"center",justifyContent:"center", height:"100vh", width: "100vw", backgroundImage: 'url(/warningBackGround.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
          <Stack>
            <Box sx={{height:"50vh"}}/>
        <Typography variant="body1" sx={{textAlign:"center", color: 'white'}}>
          <strong>プロンプトインジェクションが検知されました。<br/>面接を中止します。</strong>
        </Typography>
        <Link href="/" passHref>
          <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Button variant="outlined" sx={{mt:3, color: 'white', borderColor: 'white'}}>反省してホームに戻る</Button>
          </Box>
        </Link>
          </Stack>
        </Box>
      </Box>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 4, height: '90vh' }}>
      <Container sx={{height:"85%" ,flex: 1,overflow: "auto",padding: "20px",display: "flex", flexDirection: "column",gap: "16px",}}>      
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
          multiline
          minRows={3} 
          maxRows={3}         
        />
        <IconButton
          color="primary"
          disabled={isEnd || isSend || !userMessage}
          onClick={()=>handleSubmit(userMessage)}
          sx={{ alignSelf: 'flex-start', mt: 1, color: 'black' }}
        >
          <SendIcon sx={{color:"black"}}/>
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
