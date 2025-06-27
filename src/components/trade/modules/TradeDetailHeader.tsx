import { Box, Typography, Chip } from '@mui/material';
import { getStatusLabel } from '../constants';

interface TradeDetailHeaderProps {
    title: string;
    tradeStatus: string;
    isOwner: boolean;
    onCancel: () => void;
}

export default function TradeDetailHeader({ title, tradeStatus, isOwner, onCancel }: TradeDetailHeaderProps) {
    return (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h4">
                {title}
            </Typography>
            <Chip
                sx={{ ml: 2 }}
                label={getStatusLabel(tradeStatus)}
                color={tradeStatus === 'WAITING' ? 'primary' : 'secondary'}
            />
            {isOwner && tradeStatus === 'WAITING' &&
                <Chip
                    label={'교환 취소하기'}
                    color={'error'}
                    onClick={onCancel}
                    sx={{cursor: 'pointer', ml: 2, '&:hover': {backgroundColor: 'rgba(246, 104, 94, 1)'}}}
                />
            }
        </Box>
    );
}