
import { useState, useEffect } from 'react';
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
    Typography
} from '@mui/material';
import api from '../api/axios';

export default function Trade() {
    const [trades, setTrades] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [status, setStatus] = useState('');
    const [grade, setGrade] = useState('');

    const statusOptions = [
        { value: 'ALL', label: '전체' },
        { value: 'WAITING', label: '대기' },
        { value: 'COMPLETED', label: '완료' },
        { value: 'REJECTED', label: '거절' },
        { value: 'CANCEL', label: '취소' }
    ];

    const gradeOptions = [
        { value: 100, label: '전체' },
        { value: 0, label: 'SSR' },
        { value: 1, label: 'SR' },
        { value: 2, label: 'R' },
        { value: 3, label: 'N' },
        { value: 4, label: 'C' },
        { value: 5, label: 'V' }
    ];

    const fetchTrades = async () => {
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusLabel = (status) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.label : status;
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
                        onChange={(e) => setStatus(e.target.value)}
                        variant={"filled"}>
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
                        onChange={(e) => setGrade(e.target.value)}
                        variant={"filled"}>
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
                            <TableCell align={"center"}>번호</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell align={"center"}>카드등급</TableCell>
                            <TableCell align={"center"}>카드 개수</TableCell>
                            <TableCell align={"center"}>상태</TableCell>
                            <TableCell align={"center"}>작성자</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trades.map((trade, index) => (
                            <TableRow key={trade.tradeId}>
                                <TableCell align={"center"}>{totalElements - index}</TableCell>
                                <TableCell>{trade.title}</TableCell>
                                <TableCell align={"center"}>{trade.grade}</TableCell>
                                <TableCell align={"center"}>{trade.cardCount}</TableCell>
                                <TableCell align={"center"}>{getStatusLabel(trade.tradeStatus)}</TableCell>
                                <TableCell align={"center"}>{trade.nickname}</TableCell>
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