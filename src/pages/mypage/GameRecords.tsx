import { useEffect, useState } from 'react';
import api from '../../common/axios';
import { useUser } from '../../common/UserContext';
import {
    Box,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { format } from 'date-fns';

interface GameRecord {
    player1: string;
    player2: string;
    gameResult: 'win' | 'lose' | 'draw';
    gameDate: string;
}

const GameResultCell = ({ result }: { result: GameRecord['gameResult'] }) => {
    const style = {
        fontWeight: 'bold',
        color: result === 'win' ? '#6a6af3' : result === 'lose' ? '#ff6363' : '#2d8f2d',
    };
    return <TableCell align="center" sx={style}>{result.toUpperCase()}</TableCell>;
};

export default function GameRecords() {
    const { userInfo } = useUser();
    const [records, setRecords] = useState<GameRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            if (!userInfo) return;
            try {
                const response = await api.get(`/user/gameRecords`);
                setRecords(response.data.data);
            } catch (err) {
                setError('전적을 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [userInfo]);

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // 승, 무, 패 계산
    const wins = records.filter(r => r.gameResult === 'win').length;
    const draws = records.filter(r => r.gameResult === 'draw').length;
    const losses = records.filter(r => r.gameResult === 'lose').length;
    const totalGames = records.length;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

    return (
        <Box>
            <Paper sx={{ mb: 2, p: 2, textAlign: 'center' }}>
                <Typography variant="h6">최근 {totalGames}게임 전적</Typography>
                <Typography variant="body1">
                    {wins}승 {draws}무 {losses}패 (승률: {winRate}%)
                </Typography>
            </Paper>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">No.</TableCell>
                            <TableCell align="center">Player 1 (블루)</TableCell>
                            <TableCell align="center">Player 2 (레드)</TableCell>
                            <TableCell align="center">결과</TableCell>
                            <TableCell align="center">날짜</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{records.length - index}</TableCell>
                                    <TableCell align="center">{record.player1}</TableCell>
                                    <TableCell align="center">{record.player2}</TableCell>
                                    <GameResultCell result={record.gameResult} />
                                    <TableCell align="center">
                                        {format(new Date(record.gameDate), 'MM월 dd일 HH시 mm분')}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">게임 기록이 없습니다.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
