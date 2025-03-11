"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
    Paper,
    Divider,
} from "@mui/material";
import type { ResumeTypes, SelectedResumeTypes } from "@/types";
import Link from "next/link";
import { Edit, GridView,AccountBox } from "@mui/icons-material";

import { createClient } from "@/utils/supabase/client";

import { userAtom } from "@/atoms/state";
import { useAtom } from "jotai";
import { SupabaseDatabase } from "@/utils/supabase/database";

export default function SelectedResume() {
    const [user,] = useAtom(userAtom);
    
    const [resume, setResume] = useState<ResumeTypes | null>(null);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>("");
    const [isFetchingResume, setIsFetchingResume] = useState<boolean>(true);    

    useEffect(() => {
        const initClient = async () => {
            
            try {
                const client = await createClient();
                             
                if (user&&user.uid) {
                    const selectedResumeTable = new SupabaseDatabase<SelectedResumeTypes>("selectedResumes",client);
                    const resumeTable = new SupabaseDatabase<ResumeTypes>("resumes",client);
                    try {                        
                        const selectedDataFromDatabase = await selectedResumeTable.getArrayDataByUserId(user.uid);
                        if (selectedDataFromDatabase.length > 0) {
                            const resumeData = await resumeTable.getDataById(selectedDataFromDatabase[0].resumeId);
                            if (resumeData) {
                                setResume(resumeData);
                                setSelectedResumeId(selectedDataFromDatabase[0].resumeId);
                            }
                        } else {
                            console.log("No selected resume found for user:", user.uid);
                        }
                    } catch (error) {
                        console.error("Error fetching selected resume:", error);
                    }
                }
                             
            } catch (error) {
                console.error("Supabase client の初期化エラー:", error);
            } finally {
                setIsFetchingResume(false);
            }
        };
        initClient();
    }, [user]);

    const longTextStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    };

    const displayValue = (value: string | undefined) =>
        value && value.trim() !== "" ? value : "未記入";

    if (isFetchingResume || !resume) {
        return (
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
        );
    }

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{ width: "100%", px: 0, mx: 0, pb: 0, height: "100%" }}
        >
            <Paper variant="outlined" sx={{ p: 3, height: 540 }}>
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
                        {displayValue(resume.selfPromotion)}
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
                        {displayValue(resume.studentAchievements)}
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
                        {displayValue(resume.reasonForApply)}
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
        </Container>
    );
}