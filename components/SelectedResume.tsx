import React, { useEffect, useState, useContext } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
    Paper,
    Divider,
} from "@mui/material";
import { AuthContext } from "@/provider/AuthContext";
import type { ResumeTypes, SelectedResumeTypes } from "@/types";
import { getArrayDataFromFirestore, getDataFromFirestoreWithId } from "@/utils/handleFirebase";
import Link from "next/link";
import { Edit, GridView,AccountBox } from "@mui/icons-material";


export default function SelectedResume() {
    const { user } = useContext(AuthContext);
    const [resume, setResume] = useState<ResumeTypes | null>(null);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>("");
    const [isFetchingResume, setIsFetchingResume] = useState<boolean>(true);

    // Firestoreからデータを取得する非同期処理
    useEffect(() => {
        const fetchResume = async () => {
            if (user) {
                // 選択された履歴書のIDをFirestoreから取得
                const selectedDataFromFirestore = await getArrayDataFromFirestore<SelectedResumeTypes>("selectedResume", user.uid);
                if (selectedDataFromFirestore.length > 0) {
                    const selectedResumeIdFromFirestore = selectedDataFromFirestore[0].selectedResumeId;
                    // 取得したidを基に履歴書の詳細データをFirestoreから取得
                    const resumeData = await getDataFromFirestoreWithId<ResumeTypes>("resumes", selectedResumeIdFromFirestore);
                    setResume(resumeData);
                    setSelectedResumeId(selectedResumeIdFromFirestore);
                }
                setIsFetchingResume(false);
            }
        };
        fetchResume();
    }, [user]);

    // 複数行表示を制限すｊるためのスタイル設定
    const longTextStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    };

    // 値が空またはスペースのみの場合は「未記入」を返す関数
    const displayValue = (value: string | undefined) =>
        value && value.trim() !== "" ? value : "未記入";

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{ width: "100%", px: 0, mx: 0, pb: 0, height: "100%" }}
        >
            {(isFetchingResume || !resume) ? (
                <Paper
                    variant="outlined"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 540,
                    }}
                >
                    <CircularProgress />
                </Paper>
            ) : (
                <>
                    <Paper variant="outlined" sx={{ p: 3, height: 540 }}>
                        {/* 履歴書の名前 */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={longTextStyle}
                                >
                                    {displayValue(resume.name)}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {displayValue(resume.education)}
                                </Typography>
                            </Box>
                            <AccountBox sx={{height:70,width:70,m:0,p:0}}/>

                        </Box>
                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
                            >
                                プログラミング経験・使用言語
                            </Typography>
                            <Typography variant="body1" sx={longTextStyle}>
                                {displayValue(resume.programming)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
                            >
                                研究
                            </Typography>
                            <Typography variant="body1" sx={longTextStyle}>
                                {displayValue(resume.research)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
                            >
                                自己PR
                            </Typography>
                            <Typography variant="body1" sx={longTextStyle}>
                                {displayValue(resume.selfPR)}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
                            >
                                学生時代に頑張ったこと
                            </Typography>
                            <Typography variant="body1" sx={longTextStyle}>
                                {displayValue(resume.bestAtStu)}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
                            >
                                志望理由
                            </Typography>
                            <Typography variant="body1" sx={longTextStyle}>
                                {displayValue(resume.reason)}
                            </Typography>
                        </Box>
                    </Paper>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Link href={"/resume"} passHref>
                            <Button
                                variant="outlined"
                                startIcon={<GridView />}
                                sx={{
                                    minWidth: "100px",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                            >
                                一覧へ
                            </Button>
                        </Link>
                        <Link href={`/resume/${selectedResumeId}`} passHref>
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                sx={{
                                    minWidth: "100px",
                                    "&:hover": { opacity: 0.9 },
                                }}
                            >
                                編集・詳細
                            </Button>
                        </Link>
                    </Box>
                </>
            )}
        </Container>
    );
}