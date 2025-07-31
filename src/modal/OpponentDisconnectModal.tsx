import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import * as React from "react";

interface OpponentDisconnectModalProps {
    open: boolean;
    timeLeft: number;
}

const OpponentDisconnectModal: React.FC<OpponentDisconnectModalProps> = ({
    open, timeLeft
}) => {
    return (
        <Dialog open={open} disableEscapeKeyDown>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>상대방 연결 끊김</DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    상대방의 연결이 끊겼습니다. 잠시만 기다려 주세요.
                </Typography>
                <Box sx={{ fontSize: '3rem', fontWeight: 'bold', color: 'primary.main' }}>
                    {timeLeft}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    초 후 게임이 자동 종료됩니다.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default OpponentDisconnectModal;
