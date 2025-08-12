import { useEffect, useState } from 'react';
import apiClient from '../common/axios';
import { ApiResponse } from '../common/ApiResponse';
import '../styles/Ranking.css';
import {Avatar, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";

interface RankResponseDto {
    username: string;
    nickname: string;
    imageUrl: string;
    rankScore: number;
    rating: number;
}

// Helper component for displaying profile images or initial letters
const ProfileAvatar = ({ imageUrl, nickname }: { imageUrl: string | null, nickname: string }) => {
    const avatarStyle = {
        width: '102px',
        height: '102px',
        color: 'white',
    };

    return <Avatar src={imageUrl} alt={nickname} sx={avatarStyle} />;
};

const Ranking = () => {
    const [rankings, setRankings] = useState<RankResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await apiClient.get<ApiResponse<RankResponseDto[]>>('/rank');
                if (response.data.status === 200) {
                    setRankings(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch rankings.');
                }
            } catch (err) {
                setError('An error occurred while fetching rankings.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return <Box className="ranking-container">Loading...</Box>;
    }

    if (error) {
        return <Box className="ranking-container">Error: {error}</Box>;
    }

    const topThree = rankings.slice(0, 3);
    const restOfRankings = rankings.slice(3);

    // Add a rank property to the DTOs for display
    const getRankedData = (data: RankResponseDto[], startRank: number) => 
        data.map((r, i) => ({ ...r, rank: i + startRank }));

    const rankedTopThree = getRankedData(topThree, 1);
    const rankedRest = getRankedData(restOfRankings, 4);

    const findByRank = (rank: number) => rankedTopThree.find(r => r.rank === rank);

    return (
        <Paper sx={{mt:2}} className="ranking-container">
            <Typography variant="h3" sx={{mb:2}}>Top 10 Rank</Typography>
            <Box className="podium">
                {findByRank(2) && (
                    <Box className="podium-item silver">
                        <ProfileAvatar imageUrl={findByRank(2)!.imageUrl} nickname={findByRank(2)!.nickname} />
                        <Box className="podium-nickname">{findByRank(2)!.nickname}</Box>
                        <Box className="podium-score">{findByRank(2)!.rankScore} ({findByRank(2)!.rating.toFixed(1)}%)</Box>
                    </Box>
                )}
                {findByRank(1) && (
                    <Box className="podium-item gold">
                        <ProfileAvatar imageUrl={findByRank(1)!.imageUrl} nickname={findByRank(1)!.nickname}/>
                        <Box className="podium-nickname">{findByRank(1)!.nickname}</Box>
                        <Box className="podium-score">{findByRank(1)!.rankScore} ({findByRank(1)!.rating.toFixed(1)}%)</Box>
                    </Box>
                )}
                {findByRank(3) && (
                    <Box className="podium-item bronze">
                        <ProfileAvatar imageUrl={findByRank(3)!.imageUrl} nickname={findByRank(3)!.nickname} />
                        <Box className="podium-nickname">{findByRank(3)!.nickname}</Box>
                        <Box className="podium-score">{findByRank(3)!.rankScore} ({findByRank(3)!.rating.toFixed(1)}%)</Box>
                    </Box>
                )}
            </Box>

            <Table className="ranking-table">
                <TableHead>
                    <TableRow>
                        <TableCell>순위</TableCell>
                        <TableCell>닉네임</TableCell>
                        <TableCell>승점 (승률)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rankedRest.map((player) => (
                        <TableRow key={player.username}>
                            <TableCell sx={{fontSize: 20}}>{player.rank}</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={player.imageUrl}
                                        alt={player.nickname}
                                        sx={{ width: 52, height: 52 }}
                                    />
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {player.nickname}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{fontSize: 16}}>{player.rankScore} ({player.rating.toFixed(1)}%)</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default Ranking;