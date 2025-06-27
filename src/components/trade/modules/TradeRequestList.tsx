import { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Typography,
    Box
} from '@mui/material';
import api from '../../../common/axios';
import { ApiResponse } from '../../../common/ApiResponse';
import { TradeRequestListDto } from '../dto';
import { getStatusLabel } from '../constants';
import TradeRequestDetailModal from './TradeRequestDetailModal';

interface TradeRequestListProps {
    tradeId: string;
}

export default function TradeRequestList({ tradeId }: TradeRequestListProps) {
    const [requests, setRequests] = useState<TradeRequestListDto[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<TradeRequestListDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRequestList = async () => {
        if (!tradeId) return;
        try {
            const response = await api.get<ApiResponse<TradeRequestListDto[]>>(`/trade/request/${tradeId}`);
            setRequests(response.data.data);
        } catch (error) {
            console.error('교환 신청 목록을 불러오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        fetchRequestList();
    }, [tradeId]);

    const handleRowClick = (request: TradeRequestListDto) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleSuccess = () => {
        fetchRequestList();
    };

    if (requests.length === 0) {
        return <Typography sx={{mt: 2, textAlign: 'center'}}>교환 신청이 없습니다.</Typography>;
    }

    return (
        <Box>
            <TableContainer component={Paper} sx={{mt: 2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">번호</TableCell>
                            <TableCell align="center">신청자</TableCell>
                            <TableCell align="center">신청 카드 수</TableCell>
                            <TableCell align="center">상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request,index) => (
                            <TableRow
                                key={request.id}
                                onClick={() => handleRowClick(request)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                            >
                                <TableCell align="center">{index+1}</TableCell>
                                <TableCell align="center">{request.nickname}</TableCell>
                                <TableCell align="center">{request.cardCount}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={getStatusLabel(request.tradeStatus)}
                                        color={request.tradeStatus === 'WAITING' ? 'primary' : 'secondary'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TradeRequestDetailModal
                open={isModalOpen}
                onClose={handleCloseModal}
                requestData={selectedRequest}
                tradeId={tradeId}
                onSuccess={handleSuccess}
            />
        </Box>
    );
}