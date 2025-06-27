import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import { Trade } from '../dto';
import { getStatusLabel } from "../constants";

interface TradeTableProps {
    trades: Trade[];
    totalElements: number;
    page: number;
    rowsPerPage: number;
    onRowClick: (trade: Trade) => void;
}

export default function TradeTable({ trades, totalElements, page, rowsPerPage, onRowClick }: TradeTableProps) {
    return (
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
                        <TableRow
                            key={trade.tradeId}
                            onClick={() => onRowClick(trade)}
                            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                        >
                            <TableCell align="center">{totalElements - (page * rowsPerPage + index)}</TableCell>
                            <TableCell>{trade.title}</TableCell>
                            <TableCell align="center">{trade.grade}</TableCell>
                            <TableCell align="center">{trade.cardCount}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={getStatusLabel(trade.tradeStatus)}
                                    color={trade.tradeStatus === 'WAITING' ? 'primary' : 'secondary'}
                                />
                            </TableCell>
                            <TableCell align="center">{trade.nickname}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}