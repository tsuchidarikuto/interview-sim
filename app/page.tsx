'use client';
import {useState} from 'react';
import {Box, Tab, Card,CardContent,Typography,Container} from '@mui/material';
import Company from '@/components/Company';
import Resume from '@/components/Resume';
import {TabList,TabContext,TabPanel} from '@mui/lab';
import InterviewSetting from '@/components/InterviewSetting';
export default function CenteredTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (

    <Container maxWidth="md" sx={{ mt: 3, mb: 4, }}>    
      
  
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered >
            <Tab label="プロフィール" value="1" />
            <Tab label="企業情報" value="2" />
            <Tab label="面接設定" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><Resume/></TabPanel>
        <TabPanel value="2"><Company/></TabPanel>
        <TabPanel value="3"><InterviewSetting/></TabPanel>
      </TabContext>
      </Container>
  
  );
}
