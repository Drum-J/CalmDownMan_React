import { Modal, Box, Typography, Button, CardMedia, Stack } from '@mui/material';
import { MyGameCardDto } from '../components/game/dto';
import './Modal.css';
import * as React from "react";

interface CardDetailModalProps {
    open: boolean;
    onClose: () => void;
    card: MyGameCardDto | null;
    onSubmit?: (cardId: number) => void; // 카드 제출을 위한 콜백 (선택 사항으로 변경)
    isMyTurn?: boolean; // 내 턴인지 여부 (선택 사항으로 변경)
    isFieldCard?: boolean; // 필드 카드인지 여부 추가
}

const GameCardDetailModal: React.FC<CardDetailModalProps> = ({ open, onClose, card, onSubmit, isMyTurn, isFieldCard }) => {
    if (!card) {
        return null; // 카드가 없으면 모달을 렌더링하지 않음
    }

    const handleSubmitClick = () => {
        if (onSubmit && card) {
            onSubmit(card.gameCardId);
            onClose(); // 제출 후 모달 닫기
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="game-card-detail-modal-title"
            aria-describedby="game-card-detail-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box className="modal-content" sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                <CardMedia
                    component="img"
                    image={card.imageUrl}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    sx={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain', mb: 2 }}
                />
                <Box id="game-card-detail-modal-description" sx={{ mt: 2 }}>
                    <Typography><strong>등급:</strong> {card.grade}</Typography>
                    <Typography><strong>침투력:</strong> {card.power}</Typography>
                    <Typography><strong>공격 타입:</strong> {card.attackType}</Typography>
                </Box>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    {!isFieldCard && (
                        <Button onClick={handleSubmitClick} variant="contained" color="primary" disabled={!isMyTurn}>
                            제출
                        </Button>
                    )}
                    <Button onClick={onClose} variant="contained" color="secondary">
                        닫기
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default GameCardDetailModal;
