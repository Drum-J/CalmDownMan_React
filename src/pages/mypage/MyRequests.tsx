import {
    TablePagination,
    Box,
    Typography,
} from '@mui/material';
import TradeFilter from '../../components/trade/modules/TradeFilter';
import TradeTable from '../../components/trade/modules/TradeTable';
import { useUser } from '../../common/UserContext';
import { useTradeList } from '../../hooks/useTradeList';

export default function MyRequests() {
    const { userInfo } = useUser();
    const {
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
    } = useTradeList({
        requesterId: userInfo?.id,
        sourcePath: '/mypage/requests'
    });

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom component="div">
                    내가 신청한 교환글
                </Typography>
            </Box>

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
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="페이지당 행 수"
            />
        </Box>
    );
}