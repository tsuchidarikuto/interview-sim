"use client";

import {Tab,Card,CardHeader,CardContent} from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab';
import { useState } from 'react';
import SelectedResume from '@/components/SelectedResume';
import SelectedCompany from '@/components/SelectedCompany';


export default function ResumeAndCompanyTab() {
    const [tabValue, setTabValue] = useState("1");
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
		setTabValue(newValue);
	};

    return(
        <Card variant="outlined" sx={{p:1,pb:0,height:{md:740}}}>
            <CardHeader title="履歴書と企業情報" subheader="選択した履歴書と企業情報を確認・編集できます。" sx={{pb:0}} subheaderTypographyProps={{ sx: { fontSize: { xs: '0.8rem', sm: '1rem' } } }}/>
            
            <CardContent sx={{py:0}}>
					<TabContext value={tabValue} >
						
							<TabList onChange={handleChange} aria-label="lab API tabs example" centered>
								<Tab label="プロフィール" value="1" />
								<Tab label="企業情報" value="2" />
							</TabList>
						
						<TabPanel value="1" sx={{ p: 0 }}>
							<SelectedResume />
						</TabPanel>
						<TabPanel value="2" sx={{ p: 0 }}>
							<SelectedCompany />
						</TabPanel>
					</TabContext>
                    </CardContent>
				</Card>
    )
}