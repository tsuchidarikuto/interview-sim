// app/ranking/page.tsx
'use client';
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import {
  Tab,
  Box,
  Typography,
  Button  
} from '@mui/material';


import { TabList, TabContext, TabPanel } from '@mui/lab';
import { rankingAtom, userAtom } from "@/atoms/state";
import { useAtom } from "jotai";
import Ranking from "@/components/Ranking";
import { RankingTypes } from '@/types';
import { SupabaseDatabase } from '@/utils/supabase/database';
import { createClient } from '@/utils/supabase/client';


export default function Page() {
  const supabase = createClient();
  const [user,] = useAtom(userAtom);
  const [tabValue, setTabValue] = useState("1");
  const [ranking, setRanking] = useAtom(rankingAtom);
  const [isFetching, setIsFetching] = useState(true);
  const rankingTable = new SupabaseDatabase<RankingTypes>("rankings",supabase);

  const [, setBestUserRanking] = useState<RankingTypes>();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const getRankingData = async () => {
    try {
      const rankingDataFromDatabase = await rankingTable.getSortedData('totalScore','desc');
      return rankingDataFromDatabase;
      
    } catch (e) {
      console.error("Error fetching ranking data:", e);
      return [];
    }
  };

  useEffect(() => {    
    (async () => {
      setIsFetching(true);
      const data = await getRankingData();
      setRanking(data);
      setIsFetching(false);

      if (user) {
        const userRankings = data.filter(item => item.uid === user.uid);
        if (userRankings.length > 0) {
          const bestRanking = userRankings.reduce((prev, current) => (prev.totalScore > current.totalScore) ? prev : current);
          setBestUserRanking(bestRanking);
        }
      }
    })();
  }, [user]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, minHeight: '80vh' }}>
      <Box sx={{ my: 2 }}>
        <Typography variant="h4"><strong>Ranking</strong></Typography>                
          <Typography variant="subtitle1" color="text.secondary">
                          難易度ごとのランキングをチェックしましょう。
                      </Typography>
                  </Box>
      <Box sx={{ height: "vh"}}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, backgroundColor: '#fff'}}>
            <TabList onChange={handleChange} centered>
              <Tab label="簡単" value="1" />
              <Tab label="普通" value="2" />
              <Tab label="難しい" value="3" />
              <Tab label="激ムズ" value="4" />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{p:0}}><Ranking ranking={ranking} isFetching={isFetching} difficulty="簡単" /></TabPanel>
          <TabPanel value="2" sx={{p:0}}><Ranking ranking={ranking} isFetching={isFetching} difficulty="普通" /></TabPanel>
          <TabPanel value="3" sx={{p:0}}><Ranking ranking={ranking} isFetching={isFetching} difficulty="難しい" /></TabPanel>
          <TabPanel value="4" sx={{p:0}}><Ranking ranking={ranking} isFetching={isFetching} difficulty="激ムズ" /></TabPanel>
        </TabContext>
      </Box>    
      <Link href="/" passHref style={{ textDecoration: 'none' }}>
        <Button variant="contained" sx={{ mt: 3 }}>ホームへ</Button>
      </Link>
    </Box>
  );
}