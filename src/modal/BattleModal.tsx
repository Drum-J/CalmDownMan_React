import {Modal, Box, Typography, Stack, Button} from '@mui/material';
import * as React from "react";
import './Modal.css';

interface BattleModalProps {
    open: boolean;
    onClose: () => void;
    card1ImageUrl: string | null;
    card2ImageUrl: string | null;
    winnerId: number | null; // 승자 ID
    myPlayerId: number; // 내 플레이어 ID
}

const BattleModal: React.FC<BattleModalProps> = ({
    open, onClose, card1ImageUrl, card2ImageUrl, winnerId, myPlayerId
}) => {

    const getBattleResultMessage = () => {
        if (winnerId === 0) {
            return "무승부!";
        } else if (winnerId === myPlayerId) {
            return "승리!";
        } else {
            return "패배...";
        }
    };

    return (
        <Modal
            open={open}
            aria-labelledby="battle-modal-title"
            aria-describedby="battle-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box className="modal-content" style={{width: 800}} sx={{ p: 4, textAlign: 'center', maxWidth: 600 }}>
                <Typography id="battle-modal-title" variant="h4" component="h2" gutterBottom>
                    배틀!
                </Typography>
                <Stack direction="row" spacing={4} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                    <Box>
                        {card1ImageUrl && (
                            <img src={card1ImageUrl} alt="Card 1" style={{ width: 200, height: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                    </Box>
                    <Typography variant="h3">VS</Typography>
                    <Box>
                        {card2ImageUrl && (
                            <img src={card2ImageUrl} alt="Card 2" style={{ width: 200, height: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
                        )}
                    </Box>
                </Stack>
                {winnerId !== undefined && ( // winnerId가 설정되면 결과 메시지 표시
                    <Typography variant="h5" sx={{ mt: 2, color: winnerId === myPlayerId ? 'green' : (winnerId === 0 ? 'orange' : 'red') }}>
                        {getBattleResultMessage()}
                    </Typography>
                )}
                <Button
                    sx={{ mt: 2, width: '100%' }}
                    onClick={onClose}
                    variant="contained"
                    color="primary"
                >
                    닫기
                </Button>
            </Box>
        </Modal>
    );
};

export default BattleModal;
