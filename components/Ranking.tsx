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
import { userAtom } from '@/atoms/state';
import { useAtom } from 'jotai';


type RankStyle = React.CSSProperties;

interface RankingProps {
    ranking: RankingTypes[];
    isFetching: boolean;
    difficulty: string;
}

export default function Ranking({ ranking, isFetching, difficulty }: RankingProps) {
    const [user,] = useAtom(userAtom);

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
                <CardContent >
                    <Box sx={{ height:"50vh", overflowY: 'auto' }}>
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
                                    {item.userName || 'No Name'}
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
                    </Box>
                    
                        <Box
                            sx={{
                                p: 2,
                                mt: 3,
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                border: '2px solid black'
                            }}
                        >
                            
                            <Typography variant="h6">
                                <strong>Your Best ({difficulty})</strong>
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {userBestRanking ? `Score: ${userBestRanking.totalScore}` : 'データはまだありません'}
                            </Typography>
                            
                        </Box>
                    
                </CardContent>
            )}
        </Card>
    );
}
