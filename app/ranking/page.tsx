// app/ranking/page.tsx
'use client';
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import {
  Tab,
  Box,
  Typography,
  Button,
  CircularProgress,
  Tabs
} from '@mui/material';
import { HistoryTypes } from '@/types';
import { AuthContext } from '@/provider/AuthContext';
import { firestore } from '@/firebase';
import { collection, getDocs, query, where, orderBy } from '@firebase/firestore';
import { TabList, TabContext, TabPanel } from '@mui/lab';
import { rankingAtom } from "@/atoms/state";
import { useAtom } from "jotai";
import Ranking from "@/components/Ranking";
import { RankingTypes } from '@/types';

export default function Page() {
  const [tabValue, setTabValue] = useState("1");
  const [ranking, setRanking] = useAtom(rankingAtom);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useContext(AuthContext);
  const [bestUserRanking, setBestUserRanking] = useState<RankingTypes>();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const getRankingData = async () => {
    try {
      const q = query(
        collection(firestore, "history"),
        where('isRankedIn', '==', true),
        orderBy("totalScore", "desc")
      );
      const snapShot = await getDocs(q);
      if (snapShot.empty) return [];
      return snapShot.docs.map(doc => {
        const data = doc.data() as HistoryTypes;
        return {
          uid: data.resume.uid,
          name: data.resume.name,
          difficulty: data.setting.difficulty,
          totalScore: data.totalScore
        };
      });
    } catch (e) {
      console.error(e);
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        <strong>Ranking</strong>
      </Typography>
      <Box sx={{ height: "60vh"}}>
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