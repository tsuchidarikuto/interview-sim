import React, { useEffect, useState, useContext } from "react";
import { Box, Button, CircularProgress, Container, Typography, Paper, Divider } from "@mui/material";

import { AuthContext } from "@/provider/AuthContext";
import type { CompanyTypes, SelectedCompanyTypes } from "@/types";
import { getArrayDataFromFirestore, getDataFromFirestoreWithId } from "@/utils/handleFirebase";
import Link from "next/link";
import { Edit, ArrowBack } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";

export default function SelectedCompany() {
    const { user } = useContext(AuthContext);
    const [company, setCompany] = useState<CompanyTypes | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>("");
    const [isFetchingCompany, setIsFetchingCompany] = useState<boolean>(true);

    useEffect(() => {
        const fetchCompany = async () => {
            if (user) {
                const selectedDataFromFirestore = await getArrayDataFromFirestore<SelectedCompanyTypes>("selectedCompany", user.uid);
                if (selectedDataFromFirestore.length > 0) {
                    const selectedCompanyIdFromFirestore = selectedDataFromFirestore[0].selectedCompanyId;          
                    const companyData = await getDataFromFirestoreWithId<CompanyTypes>("company", selectedCompanyIdFromFirestore);
                    console.log(companyData);
                    setCompany(companyData);
                    setSelectedCompanyId(selectedCompanyIdFromFirestore);
                }
                setIsFetchingCompany(false);
            }
        };
        fetchCompany();
    }, [user]);

    if (isFetchingCompany) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!company) {
        return (
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
                    <Typography variant="h6">企業データが見つかりませんでした。</Typography>
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
        <Container disableGutters maxWidth={false} sx={{ width: "100%", px: 0, mx: 0 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold" }}
                >
                    {displayValue(company.name)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    {displayValue(company.position)}
                </Typography>
                <Divider sx={{ my: 2 }} />              

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        必須スキルセット
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(company.skillset)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        主力製品・サービス
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(company.product)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        社風
                    </Typography>
                    <Typography variant="body1">
                        {displayValue(company.culture)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        会社のミッション・ビジョン
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(company.mission)}
                    </Typography>
                </Box>

                
            </Paper>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Link href={"/company"} passHref>
                    <Button
                        variant="outlined"
                        sx={{
                            minWidth: "100px",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                    >
                        一覧へ
                    </Button>
                </Link>
                <Link href={`/company/${selectedCompanyId}`} passHref>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        sx={{
                            minWidth: "100px",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        編集・詳細
                    </Button>
                </Link>
            </Box>
        </Container>
    );
}
