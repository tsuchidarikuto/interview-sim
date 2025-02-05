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
	Card
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
import LinearProgressWithLabel from "@/components/LinearProgressWithLabel";
import { addToHistory } from "@/utils/addToHistory";
import { AuthContext } from "@/provider/AuthContext";
import checkUserInput from "@/utils/checkUserInput";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import "@/styles/chat.scss";
import Link from "next/link";

export default function Interview() {
	const { push } = useRouter();
	const { user } = useContext(AuthContext);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const [questions] = useAtom(questionsAtom);
	const [conversation, setConversation] = useState<ConversationTypes[]>([]);
	const [isSend, setIsSend] = useState<boolean>(false);
	const [questionIndex, setQuestionIndex] = useState<number>(0);
	const [isInterviewEnd, setIsInterviewEnd] = useState<boolean>(false);
	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [analysisProgress, setAnalysisProgress] = useState<number>(0);
	const [currentConversation, setCurrentConversation] = useState<ConversationTypes[]>([]);
	const [isSubjectEnd, setIsSubjectEnd] = useState<boolean>(false);
	const [interestShift, setInterestShift] = useState<number[]>([]);
	const [isInjected, setIsInjected] = useState<boolean>(false);
	const [, setInterviewResult] = useAtom(interviewResultAtom);
	const [company] = useAtom(companyAtom);
	const [resume] = useAtom(resumeAtom);
	const [setting] = useAtom(settingAtom);
	const [userMessage, setUserMessage] = useState<string>("");
	const [isLastSubject, setIsLastSubject] = useState<boolean>(false);
	const [conversationCount, setConversationCount] = useState<number>(0);

	// 難易度に応じた会話の回数制限を設定
	const conversationLimit =
		setting?.difficulty === "激ムズ"
			? 5
			: setting?.difficulty === "難しい"
			? 3
			: setting?.difficulty === "普通"
			? 2
			: 1;

	// MUIのstyledを利用してユーザーとシステムのメッセージバブルのスタイリング
	const MessageBubble = styled(Box)<{ role: string }>(({ role }) => ({
		display: "flex",
		alignItems: "center",
		marginBottom: "16px",
		// ユーザーの場合は右寄せ、システムの場合は左寄せ
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

	// 面接終了や送信中でなければテキストフィールドへ自動フォーカス
	useEffect(() => {
		if (!isInterviewEnd && !isSend) {
			inputRef.current?.focus(); // オートフォーカス
		}
	}, [isInterviewEnd, isSend]);

	// 初回レンダリング時に最初の質問を設定
	useEffect(() => {
		if (questions) {
			setCurrentConversation([
				{ role: "system", message: questions[0]?.question, interest: 3 },
			]);
		}
	}, [questions]);

	// 話題の終了フラグが立ったら、全体の会話履歴に現在の会話を追加し次の質問に進む
	useEffect(() => {
		if (isSubjectEnd) {
			// 現在の会話を全体履歴に追加
			setConversation((prev) => [...prev, ...currentConversation]);
			setCurrentConversation([]); // 現在の会話をクリア
			setConversationCount(0); // 会話数リセット
			setQuestionIndex((prev) => prev + 1); // 質問インデックス進行

			// 話題終了時、最後の質問であれば面接終了フラグを立てる
			if (isLastSubject) {
				setIsInterviewEnd(true);
			}

			if (questionIndex + 1 < questions.length) {
				// 次の質問が最後の場合、最後であることを記録する
				if (questionIndex + 1 === questions.length - 1) {
					setIsLastSubject(true);
				}
				// 次の質問を設定する
				setCurrentConversation([
					{
						role: "system",
						message: questions[questionIndex + 1].question,
						interest: 3,
					},
				]);
			}
			setIsSubjectEnd(false); // 話題終了フラグをリセット
		}
	}, [isSubjectEnd, currentConversation, isLastSubject, questionIndex, questions]);

	// 画面下部までスクロールする関数
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// 会話内容が更新されるたびにスクロールを実行
	useEffect(() => {
		scrollToBottom();
	}, [currentConversation]);

	// ユーザーの入力送信処理
	async function handleSubmit(message: string) {
		setIsSend(true);
		const updatedConversation = [...currentConversation, { role: "user", message }];
		setCurrentConversation(updatedConversation);

		// 会話回数制限に達しているかを判定
		const isConversationLimitReached = conversationCount + 1 === conversationLimit;

		if (questions) {
			// ユーザー入力の検証と応答生成を行う関数
			const checkedResponse = await checkUserInput(
				updatedConversation,
				setting,
				isLastSubject,
				isConversationLimitReached
			);
			// プロンプトインジェクションが検知された場合のフラグ
			setIsInjected(checkedResponse.isInjected);
			// 現在の話題終了かを判定
			setIsSubjectEnd(checkedResponse.isSubjectEnd);
			// 興味度の変化を記録
			setInterestShift((prev) => [...prev, checkedResponse.interest]);
			// システムの応答を会話に追加
			setCurrentConversation((prev) => [
				...prev,
				{ role: "system", message: checkedResponse.response, interest: checkedResponse.interest },
			]);
		}
		// 会話回数をインクリメント
		setConversationCount((prev) => prev + 1);
		// 入力フィールドをクリア
		setUserMessage("");
		setIsSend(false);
	}

	// 分析結果画面への遷移と面接結果の分析処理
	async function handleStartAnalyzing() {
		try {
			if (!user) throw new Error("User is not found");
			setIsAnalyzing(true);
			setAnalysisProgress(10);
			if (!company) throw new Error("Company information is not found");
			if (!resume) throw new Error("Resume information is not found");
			if (!setting) throw new Error("Setting information is not found");

			// 会話全体のデータを渡し、面接結果を分析
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
				setAnalysisProgress(80);
				// 履歴に面接結果を保存
				addToHistory(totalScore, result, company, resume, setting, conversation, interestShift, user.uid);
				setAnalysisProgress(100);
				// メールボックス画面へ遷移
				push("/mailbox");
			}
		} catch (e) {
			console.error("Error during preparation:", e);
		}
	}

	useEffect(()=>{
		if(isInjected){
			
			push('/warning')
		}
	},[isInjected])

	// UIのメインレンダリング部分
	return (
		<Container maxWidth="md" sx={{ mt: 5, mb: 4, height: "90vh" }}>
			<Container
				sx={{
					height: "85%",
					flex: 1,
					overflow: "auto",
					padding: "20px",
					display: "flex",
					flexDirection: "column",
					gap: "16px",
				}}
			>
				{[...conversation, ...currentConversation].map((item, index) => (
					<MessageBubble key={index} role={item.role}>
						{item.role === "system" && (
							<Avatar
								src={`/avatar_${item.interest}.svg`}
								alt={item.role}
								sx={{ width: 100, height: 100 }}
							/>
						)}
						<MessageContent role={item.role} variant="outlined">
							<Typography variant="body1" component="div">
								{item.message}
							</Typography>
						</MessageContent>
					</MessageBubble>
				))}
				<div ref={messagesEndRef}></div>
			</Container>
			<Box sx={{ display: "flex" }}>
				<TextField
					inputRef={inputRef}
					fullWidth
					disabled={isInterviewEnd || isSend}
					value={userMessage}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						setUserMessage(event.target.value)
					}
					placeholder="解答を入力"
					onKeyDown={(event) => {
						// Enterキーで送信（Shiftキーが押されていない場合）
						if (event.key === "Enter" && !event.shiftKey && userMessage) {
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
					disabled={isInterviewEnd || isSend || !userMessage}
					onClick={() => handleSubmit(userMessage)}
					sx={{ alignSelf: "flex-start", mt: 1, color: "black" }}
				>
					<SendIcon sx={{ color: "black" }} />
				</IconButton>
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
