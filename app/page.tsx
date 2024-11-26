'use client';
import {useState,useEffect} from 'react';
import {Box, Tab, Card, CardHeader,CardContent,Typography} from '@mui/material';
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

    <Box sx={{ width: '100%', typography: 'body1' ,mt:5,mergin:2}}>
      <Card >
      <Box>
        <Typography variant="h5" component="h1" sx={{textAlign:'center'}}>面接シミュレーター</Typography>
      </Box>
      <CardContent>
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
      </CardContent>
      </Card>
    </Box>
  );
}
