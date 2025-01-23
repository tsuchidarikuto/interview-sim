'use client';
import {useState,useContext} from 'react';
import {Box, Tab, Typography,Container,Button} from '@mui/material';
import Company from '@/components/Company';
import Resume from '@/components/Resume';
import {TabList,TabContext,TabPanel} from '@mui/lab';
import InterviewSetting from '@/components/InterviewSetting';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { useRouter}  from "next/navigation"
import {useAtom} from "jotai"
import {questionsAtom,companyAtom,settingAtom,resumeAtom} from "@/atoms/state";
import {AuthContext} from "@/provider/AuthContext"
import { PreparationInterview } from '@/utils/PreparationInterview';


export default function CenteredTabs() {
  const { user } = useContext(AuthContext);
  const { push } = useRouter();
  const [value, setValue] = useState("1");
  const [isLoadInterview,setIsLoadInterview] = useState<boolean>(false);
  const [,setQuestions]=useAtom(questionsAtom);
  const [,setResume] = useAtom (resumeAtom);
  const [,setCompany] = useAtom (companyAtom);
  const [, setSetting] = useAtom(settingAtom);
  const [progress, setProgress] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleStartInterview = async () => {
          setIsLoadInterview(true);
          try {
              if (!user) {
                  throw new Error('User not found');
              }            
              await PreparationInterview(setProgress,setQuestions,setResume,setCompany,setSetting, user.uid);
  
              setProgress(100);
              push('/interview');
              
          } catch (e) {
              console.error('Error during preparation:', e);
          }
          
      };
  if(isLoadInterview){
    return(
      <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh" }}>
        <Box sx={{width:"90%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </Box>
    )
  }

  return (

    <Container maxWidth="md" sx={{  mb: 4, }}>    
      <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <Typography variant="h4" component="div" sx={{textAlign:'center', mb:1}}>
            <strong>MenTRY</strong>
          </Typography>
          <Box sx={{ backgroundImage: 'url(/avatar_3.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',height:100,width:100}}/>
        </Box>
            <Typography variant="body2" color="text.secondary" sx={{textAlign:'center'}}>
            本アプリはAIを活用した面接シミュレーターです。<br/>
            プロフィールと志望企業の情報を入力して、実践的な面接練習を始めましょう。<br/>
            採用目指して頑張るぞ！！
            </Typography>
        
      
      <Box sx = {{ height:"65vh", overflowY: "auto"}}>
      <TabContext value={value} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
      <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="プロフィール" value="1" />
            <Tab label="企業情報" value="2" />
            <Tab label="面接設定" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1"><Resume/></TabPanel>
        <TabPanel value="2"><Company/></TabPanel>
        <TabPanel value="3"><InterviewSetting/></TabPanel>
      </TabContext>
      </Box>
      
      
                        <Box sx ={{display:"flex",justifyContent:"center", mb:13}}>
                            <Button
                                size="large"
                                variant="contained"
                                sx={{ width: '90%' }}
                                onClick={handleStartInterview}
                            >
                                面接開始
                            </Button>
                            </Box>
              
      </Container>
  
  );
}
