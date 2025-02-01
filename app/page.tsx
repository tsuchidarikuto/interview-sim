'use client';
import { useState, useContext } from 'react';
import { Box, Tab, Typography, Container, Button } from '@mui/material';
import Company from '@/components/SelectedCompany';
import Resume from '@/components/SelectedResume';
import { TabList, TabContext, TabPanel } from '@mui/lab';
import InterviewSetting from '@/components/InterviewSetting';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { questionsAtom, companyAtom, settingAtom, resumeAtom } from "@/atoms/state";
import { AuthContext } from "@/provider/AuthContext";
import { PreparationInterview } from '@/utils/PreparationInterview';

export default function CenteredTabs() {
  const { user } = useContext(AuthContext);
  const { push } = useRouter();
  const [tabValue, setTabValue] = useState("1");
  const [isLoadInterview, setIsLoadInterview] = useState<boolean>(false);
  const [, setQuestions] = useAtom(questionsAtom);
  const [, setResume] = useAtom(resumeAtom);
  const [, setCompany] = useAtom(companyAtom);
  const [, setSetting] = useAtom(settingAtom);
  const [progress, setProgress] = useState(0);

  // タブ切り替え
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // 面接開始時の動作
  const handleStartInterview = async () => {
    setIsLoadInterview(true);
    try {
      // ユーザー情報が存在するか確認
      if (!user) {
        throw new Error('User not found');
      }
    
      // 面接準備の処理（質問リストの生成、履歴書・会社情報のセットなど）
      await PreparationInterview(setProgress, setQuestions, setResume, setCompany, setSetting, user.uid);
    
      // プログレスを100%に設定して完了状態を示す
      setProgress(100);
    
      // 面接ページへ遷移
      push('/interview');
    } catch (e) {
      // 面接準備中に何らかのエラーが発生した場合はログに出力
      console.error('Error during preparation:', e);
    }
  };

  // 面接準備中はプログレスバーのみを表示
  if (isLoadInterview) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Box sx={{ width: "90%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ mt: 2, backgroundImage: 'url(/homeLogo.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: 150, width: 400 }} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        本アプリはAIを活用した面接シミュレーターです。<br />
        プロフィールと志望企業の情報を入力して、実践的な面接練習を始めましょう。<br />
        採用目指して頑張るぞ！！
      </Typography>

      <Box sx={{ height: "60vh", overflowY: "auto" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label="プロフィール" value="1" />
              <Tab label="企業情報" value="2" />
              <Tab label="面接設定" value="3" />
            </TabList>
          </Box>

          <TabPanel value="1"><Resume /></TabPanel>
          <TabPanel value="2"><Company /></TabPanel>
          <TabPanel value="3"><InterviewSetting /></TabPanel>
        </TabContext>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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
