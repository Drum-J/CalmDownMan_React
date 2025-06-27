import { useState, useEffect, ChangeEvent } from 'react';
import {
    TablePagination,
    Box,
    Typography,
    SelectChangeEvent
} from '@mui/material';
import api from '../common/axios';
import { useLocation, useNavigate } from "react-router-dom";
import { Trade as Trades, ListState } from '../components/trade/dto';
import TradeFilter from '../components/trade/modules/TradeFilter';
import TradeTable from '../components/trade/modules/TradeTable';

export default function Trade() {
    const location = useLocation();
    const listState = location.state?.listState as ListState;

    const [trades, setTrades] = useState<Trades[]>([]);
    const [page, setPage] = useState(listState?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState(listState?.rowsPerPage || 5);
    const [status, setStatus] = useState<string>(listState?.status || '');
    const [grade, setGrade] = useState<string>(listState?.grade || '');
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
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
        setPage(0);
    };

    const handleGradeChange = (event: SelectChangeEvent): void => {
        setGrade(event.target.value);
        setPage(0);
    };

    const handleRowClick = (trade: Trades) => {
        navigate(`/trade/${trade.tradeId}`, {
            state: {
                tradeData: trade,
                listState: {
                    page,
                    status,
                    grade,
                    rowsPerPage
                }
            }
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                카드 교환
            </Typography>

            <TradeFilter
                status={status}
                grade={grade}
                onStatusChange={handleStatusChange}
                onGradeChange={handleGradeChange}
            />

            <TradeTable
                trades={trades}
                totalElements={totalElements}
                page={page}
                rowsPerPage={rowsPerPage}
                onRowClick={handleRowClick}
            />

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
        </Box>
    );
}