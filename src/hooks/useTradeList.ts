import { useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import api from '../common/axios';
import { Trade, ListState } from '../components/trade/dto';

interface UseTradeListOptions {
    ownerId?: number;
    requesterId?: number;
    sourcePath: string; // '/trade', '/mypage/posts' 등 목록 페이지의 경로
}

export const useTradeList = (options: UseTradeListOptions) => {
    const { ownerId, requesterId, sourcePath } = options;
    const location = useLocation();
    const navigate = useNavigate();

    const listState = location.state?.listState as ListState;

    const [trades, setTrades] = useState<Trade[]>([]);
    const [page, setPage] = useState(listState?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState(listState?.rowsPerPage || 10);
    const [status, setStatus] = useState<string>(listState?.status || '');
    const [grade, setGrade] = useState<string>(listState?.grade || '');
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        // ownerId나 requesterId가 필요한 페이지에서 해당 ID가 아직 없을 경우 API 호출을 막습니다.
        if ((ownerId !== undefined && !ownerId) || (requesterId !== undefined && !requesterId)) {
            setTrades([]);
            setTotalElements(0);
            return;
        }

        const fetchTrades = async (): Promise<void> => {
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    size: rowsPerPage.toString(),
                });
                if (status) params.append('status', status);
                if (grade) params.append('grade', grade);
                if (ownerId) params.append('ownerId', ownerId.toString());
                if (requesterId) params.append('requesterId', requesterId.toString());

                const response = await api.get(`/trade/list?${params.toString()}`);
                setTrades(response.data.data.content);
                setTotalElements(response.data.data.page.totalElements);
            } catch (error) {
                console.error('교환글 목록을 불러오는데 실패했습니다:', error);
            }
        };
        fetchTrades();
    }, [page, rowsPerPage, status, grade, ownerId, requesterId]);

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

    const handleRowClick = (trade: Trade) => {
        navigate(`/trade/${trade.tradeId}`, {
            state: {
                tradeData: trade,
                listState: { page, status, grade, rowsPerPage },
                sourcePath: sourcePath // 현재 경로를 상세 페이지로 전달
            }
        });
    };

    return {
        trades,
        page,
        rowsPerPage,
        status,
        grade,
        totalElements,
        handleChangePage,
        handleChangeRowsPerPage,
        handleStatusChange,
        handleGradeChange,
        handleRowClick,
    };
};