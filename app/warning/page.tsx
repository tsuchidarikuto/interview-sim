'use client';
import {
	Box,
	Button,
	Stack,
	Typography,
} from "@mui/material";

import Link from "next/link";



export default function Warning () {

    
    
   
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: 'url(/warningBackGround.svg)',
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            >
                <Stack>
                    <Box sx={{ height: "50vh" }} />
                    <Typography variant="body1" sx={{ textAlign: "center", color: "white" }}>
                        <strong>
                            プロンプトインジェクションが検知されました。<br />面接を中止します。
                        </strong>
                    </Typography>
                    <Link href="/" passHref>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Button variant="outlined" sx={{ mt: 3, color: "white", borderColor: "white" }}>
                                反省してホームに戻る
                            </Button>
                        </Box>
                    </Link>
                </Stack>
            </Box>
        </Box>
    );
}

