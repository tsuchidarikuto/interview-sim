"use client";

import React from 'react';
import {
    Card,
    Box,
    Typography,
    CardContent,
    CircularProgress,
    Divider
} from '@mui/material';
import { RankingTypes } from '@/types';
import { useContext } from 'react';
import { AuthContext } from '@/provider/AuthContext';

interface RankStyle extends React.CSSProperties {}

interface RankingProps {
    ranking: RankingTypes[];
    isFetching: boolean;
    difficulty: string;
}

export default function Ranking({ ranking, isFetching, difficulty }: RankingProps) {
    const { user } = useContext(AuthContext);

    const getRankStyle = (index: number): RankStyle => {
        if (index === 0) return { color: '#FFD700', fontWeight: 'bold' };
        if (index === 1) return { color: '#C0C0C0', fontWeight: 'bold' };
        if (index === 2) return { color: '#CD7F32', fontWeight: 'bold' };
        return {};
    };

    const filteredRanking = ranking.filter(item => item.difficulty === difficulty);
    const userBestRanking = filteredRanking.find(item => item.uid === user?.uid);

    return (
        <Card variant="outlined" >
            {isFetching ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <CardContent sx={{ height:"60vh", overflowY: 'auto' }}>
                    {filteredRanking.map((item, index) => (
                        <React.Fragment key={index}>
                            <Box
                                sx={{
                                    p: 2,                                                                
                                    backgroundColor: item.uid === user?.uid ? 'rgba(165, 165, 165, 0.2)' : 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" gutterBottom sx={{ ...getRankStyle(index) }}>
                                    Rank {index + 1}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {item.name || 'No Name'}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Score: {item.totalScore}
                                </Typography>
                            </Box>
                            {index < filteredRanking.length - 1 && (
                                <Divider variant="middle" />
                            )}
                        </React.Fragment>
                    ))}
                    {userBestRanking && (
                        <Box
                            sx={{
                                p: 2,
                                mt: 3,
                                backgroundColor: 'rgba(165, 165, 165, 0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h6">
                                <strong>Your Best ({difficulty})</strong>
                            </Typography>                            
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Score: {userBestRanking.totalScore}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
