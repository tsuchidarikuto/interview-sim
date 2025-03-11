'use client';
import {
	Box,
	Button,
	Stack,
	Container,
	Card,
	Typography,
	Backdrop
} from "@mui/material";
import { useAtom } from "jotai";
import {
	questionsAtom,
	interviewResultAtom,
	resumeAtom,
	companyAtom,
	settingAtom,
	isRecordingAtom,
	isPlayingAudioAtom,
	userAtom
} from "@/atoms/state";
import { useState, useEffect, useRef } from "react";
import { ConversationTypes, interviewResultTypes } from "@/types";
import { useRouter } from "next/navigation";
import analyzeInterviewResult from "@/utils/analyzeInterviewResult";
import { addToHistory } from "@/utils/addToHistory";

import checkUserInput from "@/utils/checkUserInput";
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import { SpeachToText, stopAudio } from "@/utils/handleAzureSpeach";
import { useSpeechQueue } from "@/utils/useSpeechQueue";
import MicFeedbackButton from "@/components/MicFeedbackButton";




export default function Interview() {
	const [,setIsRecording] = useAtom(isRecordingAtom)
	const { push } = useRouter();
	const [user,] = useAtom(userAtom);
	const [questions] = useAtom(questionsAtom);
	const [conversation, setConversation] = useState<ConversationTypes[]>([]);
	const [currentConversation, setCurrentConversation] = useState<ConversationTypes[]>([]);
	const hasSpokenFirstQuestion = useRef(false);
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [isSubjectEnd, setIsSubjectEnd] = useState<boolean>(false);
	const [interestShift, setInterestShift] = useState<number[]>([]);
	const [isInjected, setIsInjected] = useState<boolean>(false);
	const [, setInterviewResult] = useAtom(interviewResultAtom);
	const [company] = useAtom(companyAtom);
	const [resume] = useAtom(resumeAtom);
	const [setting] = useAtom(settingAtom);
	const [conversationCount, setConversationCount] = useState<number>(0);
	const [isLastSubject, setIsLastSubject] = useState<boolean>(false);
	const [isInterviewEnd, setIsInterviewEnd] = useState<boolean>(false);
	const [analysisProgress, setAnalysisProgress] = useState<number>(0);
	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [currentInterest,setCurrentInterest] =useState<number>(3);
	const [,setIsPlayingAudio]=useAtom(isPlayingAudioAtom);

	const { enqueue,clearQueue } = useSpeechQueue();

	// 会話の回数制限
	const conversationLimit =
		setting?.difficulty === "激ムズ"
			? 4
			: setting?.difficulty === "難しい"
			? 3
			: setting?.difficulty === "普通"
			? 2
			: 1;

	

	// 初回レンダリング時に最初の質問を設定
	useEffect(() => {
		setIsPlayingAudio(true);
		async function speakFirstQuestion() {
			if (hasSpokenFirstQuestion.current) return;
			hasSpokenFirstQuestion.current = true;
			await enqueue(questions[0].question);
		}
		if (questions?.length) {
		
			setCurrentConversation([
				{ role: "system", message: questions[0].question, interest: 3 },
			]);
			speakFirstQuestion();
		}
		return () => {
			stopAudio();
			clearQueue();			
		};
	}, []);

	// 話題終了時の処理
	useEffect(() => {
		async function speakNextQuestion(){			
			await enqueue(questions[questionIndex + 1].question);
			setCurrentInterest(3);
		}

		if (isSubjectEnd) {
			setConversation((prev) => [...prev, ...currentConversation]);
			setCurrentConversation([]);
			setConversationCount(0);
			setQuestionIndex((prev) => prev + 1);

			if (isLastSubject) {
				setIsInterviewEnd(true);
			}

			if (questionIndex + 1 < questions.length) {
				if (questionIndex + 1 === questions.length - 1) {
					setIsLastSubject(true);
				}
				setCurrentConversation([
					{
						role: "system",
						message: questions[questionIndex + 1].question,
						interest: 3,
					},
				]);
				
				speakNextQuestion();
			}
			setIsSubjectEnd(false);
		}
	}, [isSubjectEnd]);

	useEffect(()=>{
		if(isInjected){
			stopAudio();
        
        clearQueue();        
			push('/warning')
		}
	},[isInjected])

	// ユーザーの入力送信処理
	async function handleListenUserSpeach() {		
		setIsRecording(true);
		const message = await SpeachToText();
		
		//エラー字は音声だけ出力し戻る。インクリメントや会話履歴の保存等は行わない。
		if(message==="error"){
			enqueue("すみません、聞き取れませんでした。もう一度話してください。");
			setIsRecording(false);
			return;
		}
				
		const updatedConversation = [...currentConversation, { role: "user", message }];
		setCurrentConversation(updatedConversation);

		const isConversationLimitReached = conversationCount+1 >= conversationLimit;

		if (questions) {
			const checkedResponse = await checkUserInput(
				updatedConversation,
				setting,
				isLastSubject,
				isConversationLimitReached
			);
			setCurrentInterest(checkedResponse.interest);//アイコン変更用のstateを更新
			setIsInjected(checkedResponse.isInjected);
			setIsSubjectEnd(checkedResponse.isSubjectEnd);
			setInterestShift((prev) => [...prev, checkedResponse.interest]);
			setCurrentConversation((prev) => [
				...prev,
				{
					role: "system",
					message: checkedResponse.response,
					interest: checkedResponse.interest,
				},
			]);
			
			setIsRecording(false);
			await enqueue(checkedResponse.response);
		}
		setConversationCount((prev) => prev + 1);
		
	}
	//分析開始処理
	async function handleStartAnalyzing() {
		try {
			setIsAnalyzing(true);
			if (!user) throw new Error("User is not found");
			if (!company) throw new Error("Company information is not found");
			if (!resume) throw new Error("Resume information is not found");
			if (!setting) throw new Error("Setting information is not found");

			const result: interviewResultTypes | undefined = await analyzeInterviewResult(
				JSON.stringify(conversation),
				setAnalysisProgress,
				company,
				resume,
				setting
			);

			if (result) {
				setInterviewResult(result);
				const totalScore =
					result.technicalScore +
					result.communicationScore +
					result.teamworkScore +
					result.logicalThinkingScore +
					result.learningDesireScore +
					result.companyUnderstandingScore;
				addToHistory(totalScore, result, company, resume, setting, conversation, interestShift, user.uid);
				push("/mailbox");
			}
		} catch (e) {
			console.error("Error during analysis:", e);
		}
	}
	
	
	

	return (
		<Container
			maxWidth="xs"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "80vh",
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Card
					sx={{						                                
						backgroundImage: `url(/avatar_${currentInterest}.svg)`,
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						height:300,
						width: 300,
						border:"6px solid #555555",
						borderRadius:"7%"
					}}
				/>
			</Box>
			<Box sx={{ mt: 5 }}>
				<MicFeedbackButton
					handleListenUserSpeach={handleListenUserSpeach}
				>
				</MicFeedbackButton>
			</Box>
			
			

			
			<Box sx={{ mt: 2 }}>
				{isInterviewEnd && (
					<Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
						{isAnalyzing ? (
							<Card
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "80%",
									p:3
								}}
							>
								<Typography>分析中...</Typography>
								<LinearProgressWithLabel value={analysisProgress} />
							</Card>
						) : (
							<Card sx={{p:6}}>
							<Stack spacing={3}>
							<Typography>面接は終了です。</Typography>
							<Button variant="contained" size="large" onClick={handleStartAnalyzing}>
								分析開始
							</Button>
							</Stack>
							</Card>
						)}
					</Backdrop>
				)}
			</Box>
		</Container>
	);
}
