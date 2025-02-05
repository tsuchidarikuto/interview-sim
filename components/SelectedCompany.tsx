import React, { useEffect, useState, useContext } from "react";
import { Box, Button, CircularProgress, Container, Typography, Paper, Divider } from "@mui/material";

import { AuthContext } from "@/provider/AuthContext";
import type { CompanyTypes, SelectedCompanyTypes } from "@/types";
import { getArrayDataFromFirestore, getDataFromFirestoreWithId } from "@/utils/handleFirebase";
import Link from "next/link";
import { Edit, GridView , Business} from "@mui/icons-material";


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

   const longTextStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
    };

    const displayValue = (value: string | undefined) => value && value.trim() !== "" ? value : "未記入";

    return (
        <Container disableGutters maxWidth={false} sx={{width: "100%", px: 0, mx: 0,height:"100%"}}>
            {(isFetchingCompany || !company) ? (
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
                        ) : (<>
            <Paper variant="outlined" sx={{ p: 3 ,height:540}}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Box>
                                                <Typography
                                                    variant="h5"
                                                    sx={longTextStyle}
                                                >
                                                    {displayValue(company.name)}
                                                </Typography>
                                                <Typography variant="body1" color="textSecondary">
                                                    {displayValue(company.position)}
                                                </Typography>
                                            </Box>
                                            <Business sx={{height:70,width:70,m:0,p:0}}/>
                
                                        </Box>
                <Divider sx={{ my: 2 }} />              

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        必須スキルセット
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(company.skillset)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        主力製品・サービス
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(company.product)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        社風
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
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
                <Box >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
                        その他特記事項
                    </Typography>
                    <Typography variant="body1" sx={longTextStyle}>
                        {displayValue(company.others)}
                    </Typography>
                </Box>

                
            </Paper>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Link href={"/company"} passHref>
                    <Button
                        variant="outlined"
                        startIcon={<GridView />}
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
            </>
        )}
        </Container>
    );
}
