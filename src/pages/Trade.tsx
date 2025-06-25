import { useState, useEffect, ChangeEvent } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    SelectChangeEvent
} from '@mui/material';
import api from '../common/axios';
import { useNavigate } from "react-router-dom";

interface Trade {
    tradeId: number;
    title: string;
    grade: string;
    cardCount: number;
    tradeStatus: string;
    nickname: string;
}

interface StatusOption {
    value: string;
    label: string;
}

interface GradeOption {
    value: number;
    label: string;
}

export default function Trade() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [grade, setGrade] = useState<string>('');
    const navigate = useNavigate();

    const statusOptions: StatusOption[] = [
        { value: 'ALL', label: '전체' },
        { value: 'WAITING', label: '대기' },
        { value: 'COMPLETED', label: '완료' },
        { value: 'REJECTED', label: '거절' },
        { value: 'CANCEL', label: '취소' }
    ];

    const gradeOptions: GradeOption[] = [
        { value: 100, label: '전체' },
        { value: 0, label: 'SSR' },
        { value: 1, label: 'SR' },
        { value: 2, label: 'R' },
        { value: 3, label: 'N' },
        { value: 4, label: 'C' },
        { value: 5, label: 'V' }
    ];

    const fetchTrades = async (): Promise<void> => {
        try {
            let url = `/trade/list?page=${page}&size=${rowsPerPage}`;
            if (status) url += `&status=${status}`;
            if (grade) url += `&grade=${grade}`;

            const response = await api.get(url);
            setTrades(response.data.data.content);
            setTotalElements(response.data.data.page.totalElements);
        } catch (error) {
            console.error('교환글 목록을 불러오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, [page, rowsPerPage, status, grade]);

    const handleChangePage = (_event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusChange = (event: SelectChangeEvent): void => {
        setStatus(event.target.value);
    };

    const handleGradeChange = (event: SelectChangeEvent): void => {
        setGrade(event.target.value);
    };

    const getStatusLabel = (status: string): string => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.label : status;
    };

    const handleRowClick = (trade: Trade) => {
        navigate(`/trade/${trade.tradeId}`, {
            state: { tradeData: trade }
        });
    };


    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                카드 교환
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>상태</InputLabel>
                    <Select
                        value={status}
                        label="상태"
                        onChange={handleStatusChange}
                        variant="filled">
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>등급</InputLabel>
                    <Select
                        value={grade}
                        label="등급"
                        onChange={handleGradeChange}
                        variant="filled">
                        {gradeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">번호</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell align="center">카드등급</TableCell>
                            <TableCell align="center">카드 개수</TableCell>
                            <TableCell align="center">상태</TableCell>
                            <TableCell align="center">작성자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades.map((trade, index) => (
                            <TableRow key={trade.tradeId}
                                      onClick={() => handleRowClick(trade)}
                                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                            >
                                <TableCell align="center">{totalElements - index}</TableCell>
                                <TableCell>{trade.title}</TableCell>
                                <TableCell align="center">{trade.grade}</TableCell>
                                <TableCell align="center">{trade.cardCount}</TableCell>
                                <TableCell align="center">{getStatusLabel(trade.tradeStatus)}</TableCell>
                                <TableCell align="center">{trade.nickname}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="페이지당 행 수"
            />
        </Container>
    );
}