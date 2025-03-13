'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Container,
	Button,	
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { createClient } from '@/utils/supabase/client';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/state';


import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { useRouter } from "next/navigation";
import { questionsAtom, companyAtom, settingAtom, resumeAtom } from "@/atoms/state";

import ResumeAndCompanyTab from '@/components/ResumeAndCompanyTab';

import { stopAudio } from '@/utils/handleAzureSpeach';
import InterviewSetting from '@/components/InterviewSetting';
import { PreparationInterview } from '@/utils/PreparationInterview';

/**
 * ホームページコンポーネント
 * プロフィール一覧の表示、作成、編集、削除機能を提供
 */
export default function Home() {

	const supabase = createClient();
	const { push } = useRouter();
	
	const [isLoadInterview, setIsLoadInterview] = useState<boolean>(false);
	const [, setQuestions] = useAtom(questionsAtom);
	const [, setResume] = useAtom(resumeAtom);
	const [, setCompany] = useAtom(companyAtom);
	const [, setSetting] = useAtom(settingAtom);
	const [progress, setProgress] = useState(0);
	const [user, setUser] = useAtom(userAtom);

	useEffect(() => {
		stopAudio()
	}, [])


	// ユーザー情報の取得
	useEffect(() => {
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			
			setUser({
				uid: user?.id ?? '',
				name: user?.user_metadata?.full_name ?? ''
			});
		};

		// userがnullの場合のみgetUserを呼び出す
		if (!user) {
			getUser();
		}
	}, [user, setUser]);



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
			if (selectedInterviewMode === "voice") {
				push('/interview/speech');
			} else if (selectedInterviewMode === "chat") {
				push('/interview/chat')
			} else {
				push('/')
				console.error("error during page navigation")
			}
		} catch (e) {
			// 面接準備中に何らかのエラーが発生した場合はログに出力
			console.error('Error during preparation:', e);
		}
	};

	if (isLoadInterview) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
				<Box sx={{ width: "90%" }}>
					<Typography>面接を準備しています...</Typography>
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

			<Grid container spacing={2} sx={{ py: 1 }}>				
					<>
						<Grid size={{ xs: 12, sm: 12, md: 6 }}>
							<ResumeAndCompanyTab />
						</Grid>
						<Grid size={{ xs: 12, sm: 12, md: 6 }} >
							<InterviewSetting />
						</Grid>
						<Grid size={12}>
							<Button
								size="large"
								variant="contained"
								onClick={handleStartInterview}
								fullWidth
								sx={{ mb: 5 }}
							>
								面接開始
							</Button>
						</Grid>
					</>
				
			</Grid>

		</Container>
	);
}