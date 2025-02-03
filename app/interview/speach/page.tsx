'use client';
import {
	Box,
	Button,
	Avatar,
	Container,
	Stack,
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
} from "@/atoms/state";
import { useState, useEffect, useContext, useRef } from "react";
import { ConversationTypes, interviewResultTypes } from "@/types";
import { useRouter } from "next/navigation";
import analyzeInterviewResult from "@/utils/analyzeInterviewResult";
import { addToHistory } from "@/utils/addToHistory";
import { AuthContext } from "@/provider/AuthContext";
import checkUserInput from "@/utils/checkUserInput";
import { styled } from "@mui/system";
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import Link from "next/link";
import { SpeachToText } from "@/utils/handleAzureSpeach";
import { useSpeechQueue } from "@/utils/useSpeechQueue";

export default function Interview() {
	const { push } = useRouter();
	const { user } = useContext(AuthContext);
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
  
  // Extract the enqueue function from the speech queue hook
	const { enqueue } = useSpeechQueue();

	// 会話の回数制限
	const conversationLimit =
		setting?.difficulty === "激ムズ"
			? 5
			: setting?.difficulty === "難しい"
			? 3
			: setting?.difficulty === "普通"
			? 2
			: 1;

	const CenteredAvatar = styled(Avatar)(({ theme }) => ({
		width: 200,
		height: 200,
	}));

	// 初回レンダリング時に最初の質問を設定
	useEffect(() => {
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
	}, []);

	// 話題終了時の処理
	useEffect(() => {
		async function speakNextQuestion(){
			await enqueue(questions[questionIndex + 1].question);
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

	// ユーザーの入力送信処理
	async function handleListenUserSpeach() {
		const message = await SpeachToText();
		const updatedConversation = [...currentConversation, { role: "user", message }];
		setCurrentConversation(updatedConversation);

		const isConversationLimitReached = conversationCount + 1 === conversationLimit;

		if (questions) {
			const checkedResponse = await checkUserInput(
				updatedConversation,
				setting,
				isLastSubject,
				isConversationLimitReached
			);
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
			// Use enqueue from useSpeechQueue instead of calling TextToSpeach directly
			await enqueue(checkedResponse.response);
		}
		setConversationCount((prev) => prev + 1);
	}

	async function handleStartAnalyzing() {
		try {
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
					result.score.technical +
					result.score.communication +
					result.score.teamwork +
					result.score.logicalThinking +
					result.score.learningDesire +
					result.score.companyUnderstanding;
				addToHistory(totalScore, result, company, resume, setting, conversation, interestShift, user.uid);
				push("/mailbox");
			}
		} catch (e) {
			console.error("Error during analysis:", e);
		}
	}

	if (isInjected) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					width: "100%",
					backgroundColor: "black",
				}}
			>
				<Stack spacing={3} alignItems="center">
					<CenteredAvatar src="/warningBackGround.svg" alt="warning" />
					<Typography variant="body1" sx={{ textAlign: "center", color: "white" }}>
						<strong>
							プロンプトインジェクションが検知されました。<br />
							面接を中止します。
						</strong>
					</Typography>
					<Link href="/" passHref>
						<Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
							反省してホームに戻る
						</Button>
					</Link>
				</Stack>
			</Box>
		);
	}

	const currentSystem = currentConversation.find((msg) => msg.role === "system");
	const avatarInterest = currentSystem?.interest || 3;

	return (
		<Container
			maxWidth="xs"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
			}}
		>
			<CenteredAvatar src={`/avatar_${avatarInterest}.svg`} alt="system" />
			<Box sx={{ mt: 3 }}>
				<Button variant="contained" size="large" onClick={handleListenUserSpeach}>
					録音
				</Button>
			</Box>
			<Box sx={{ mt: 2 }}>
				{isInterviewEnd && (
					<Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
						{isAnalyzing ? (
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "100%",
									margin: 10,
								}}
							>
								<Typography>分析中...</Typography>
								<LinearProgressWithLabel value={analysisProgress} />
							</Box>
						) : (
							<Button variant="contained" size="large" onClick={handleStartAnalyzing}>
								分析開始
							</Button>
						)}
					</Backdrop>
				)}
			</Box>
		</Container>
	);
}
