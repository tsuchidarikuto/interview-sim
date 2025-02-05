'use client';
import { useState, useContext ,useEffect} from 'react';
import { Box,  Typography, Container, Button } from '@mui/material';

import InterviewSetting from '@/components/InterviewSetting';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { questionsAtom, companyAtom, settingAtom, resumeAtom } from "@/atoms/state";
import { AuthContext } from "@/provider/AuthContext";
import { PreparationInterview } from '@/utils/PreparationInterview';
import ResumeAndCompanyTab from '@/components/ResumeAndCompanyTab';
import Grid from '@mui/material/Grid2'
import { stopAudio } from '@/utils/handleAzureSpeach';


export default function CenteredTabs() {
	const { user } = useContext(AuthContext);
	const { push } = useRouter();
	
	const [isLoadInterview, setIsLoadInterview] = useState<boolean>(false);
	const [, setQuestions] = useAtom(questionsAtom);
	const [, setResume] = useAtom(resumeAtom);
	const [, setCompany] = useAtom(companyAtom);
	const [setting, setSetting] = useAtom(settingAtom);
	const [progress, setProgress] = useState(0);

	
	useEffect(()=>{
		stopAudio()
	},[])
	
	// 面接開始時の動作
	const handleStartInterview = async () => {
		setIsLoadInterview(true);
		try {
			// ユーザー情報が存在するか確認
			if (!user) {
				throw new Error('User not found');
			}

			// 面接準備の処理（質問リストの生成、履歴書・会社情報のセットなど）
			const selectedInterviewMode = await PreparationInterview(setProgress, setQuestions, setResume, setCompany, setSetting, user.uid);

			// プログレスを100%に設定して完了状態を示す
			setProgress(100);

			
			// 面接モードに応じてpush先を変更
			if(selectedInterviewMode==="voice"){
				push('/interview/speach');
			} else if(selectedInterviewMode==="chat"){
				push('/interview/chat')
			} else{
				push('/')
				console.error("error during page navigation")
			}
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
		<Container maxWidth="lg">
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Box
					sx={{
						my: 2,
						backgroundImage: 'url(/homeLogo.svg)',
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						height: 120,
						width: 350,
					}}
				/>
			</Box>
			<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
				本アプリはAIを活用した面接シミュレーターです。<br />
				プロフィールと志望企業の情報を入力して、面接練習を始めましょう。<br />
			</Typography>

			
			<Grid container spacing={2} sx={{py:1}}>
				<Grid size={{xs:12,sm:12,md:6}}>
					<ResumeAndCompanyTab/>
				</Grid>
				<Grid size={{xs:12,sm:12,md:6}} >					
						<InterviewSetting />
						
				</Grid>
				<Grid size={12}>
				<Button 
					size="large"
					variant="contained"					
					onClick={handleStartInterview}
					fullWidth
					sx={{mb:5}}
				>
					面接開始
				</Button>
				</Grid>
			</Grid>
			
		</Container>
	);
}
