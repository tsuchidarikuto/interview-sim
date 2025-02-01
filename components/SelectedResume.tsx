import React, { useEffect, useState, useContext } from "react";
import { Box, Button, CircularProgress, Container, Typography, Paper, Divider } from "@mui/material";

import { AuthContext } from "@/provider/AuthContext";
import type { ResumeTypes, SelectedResumeTypes } from "@/types";
import { getArrayDataFromFirestore, getDataFromFirestoreWithId } from "@/utils/handleFirebase";
import Link from "next/link";
import { Edit, ArrowBack } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";

export default function SelectedResume() {
    const { user } = useContext(AuthContext);
    const [resume, setResume] = useState<ResumeTypes | null>(null);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>("");
    const [isFetchingResume, setIsFetchingResume] = useState<boolean>(true);

    useEffect(() => {
        const fetchResume = async () => {
            if (user) {
                const selectedDataFromFirestore = await getArrayDataFromFirestore<SelectedResumeTypes>("selectedResume", user.uid);
                if (selectedDataFromFirestore.length > 0) {
                    const selectedResumeIdFromFirestore = selectedDataFromFirestore[0].selectedResumeId;          
                    const resumeData = await getDataFromFirestoreWithId<ResumeTypes>("resumes", selectedResumeIdFromFirestore);
                    setResume(resumeData);
                    setSelectedResumeId(selectedResumeIdFromFirestore);
                }
                setIsFetchingResume(false);
            }
        };
        fetchResume();
    }, [user]);

    if (isFetchingResume) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!resume) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
                    <Typography variant="h6">履歴書データが見つかりませんでした。</Typography>
                </Paper>
            </Container>
        );
    }

    const longTextStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
    };

    const displayValue = (value: string | undefined) => value && value.trim() !== "" ? value : "未記入";

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "flex-end", 
                    gap: 2,
                    mt: 1
                }}>
                    <Typography 
                    variant="h4" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: "bold",                                                       
                        mb: {xs:0,sm:2}
                    }}
                >
                    {displayValue(resume.name)}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Link href={"/resume"} passHref>
                            <Button 
                                variant="outlined" 
                                sx={{ 
                                    minWidth: "100px",
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                            >
                                一覧へ
                            </Button>
                        </Link>
                        <Link href={`/resume/${selectedResumeId}`} passHref>
                            <Button 
                                variant="contained" 
                                startIcon={<Edit />}
                                sx={{ 
                                    minWidth: "100px",
                                    '&:hover': { opacity: 0.9 }
                                }}
                            >
                                編集
                            </Button>
                        </Link>
                    </Box>
                </Box>
                <Divider sx={{my:2}}/>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                            年齢
                        </Typography>
                        <Typography variant="body1">
                            {displayValue(resume.age?.toString())}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                            性別
                        </Typography>
                        <Typography variant="body1">
                            {{
                                1: "男",
                                2: "女",
                                3: "その他"
                            }[resume.sex] || "不明"}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        最終学歴
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(resume.education)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        プログラミング経験・使用言語
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(resume.programming)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        自己PR
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(resume.selfPR)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        研究成果
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(resume.research)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        資格
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(resume.qualification)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        学生時代に頑張ったこと
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(resume.bestAtStu)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        志望理由
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(resume.reason)}
                    </Typography>
                </Box>
                
            </Paper>
        </Container>
    );
}