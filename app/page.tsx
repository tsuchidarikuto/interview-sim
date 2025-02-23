'use client';
import { useState, useContext ,useEffect} from 'react';
import { Box,  Typography, Container, Button } from '@mui/material';

import InterviewSetting from '@/components/InterviewSetting';
import LinearProgressWithLabel from '@/components/LinearProgressWithLabel';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { questionsAtom, companyAtom, settingAtom, resumeAtom } from "@/atoms/state";
import { AuthContext } from "@/provider/AuthContext";
import { PreparationInterview } from '@/utils/PreparationInterview';
import ResumeAndCompanyTab from '@/components/ResumeAndCompanyTab';
import Grid from '@mui/material/Grid2'
import { stopAudio } from '@/utils/handleAzureSpeach';


export default function CenteredTabs() {
	

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

			
		</Container>
	);
}
