import { Box, Paper, Typography } from "@mui/material";
import { FieldCardDto } from "../dto";

interface FieldSlotProps {
    fieldNumber: number;
    card: FieldCardDto | null;
    isPlayer1: boolean;
}

const FieldSlot = ({ fieldNumber, card, isPlayer1 }: FieldSlotProps) => {
    const getBorderColor = () => {
        if (!card) {
            return 'grey.400'; // 빈 슬롯
        }

        // 내 역할(isPlayer1)과 카드 소유권(isMine)을 조합하여 테두리 색 결정
        const isMyCard = card.isMine;
        if ((isPlayer1 && isMyCard) || (!isPlayer1 && !isMyCard)) {
            return '#3B82F6'; // Player 1의 카드 (Blue)
        } else {
            return '#EF4444'; // Player 2의 카드 (Red)
        }
    };

    return (
        <Box
            sx={{
                width: 140,
                height: 200,
                border: `3px solid ${getBorderColor()}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                m: 1,
                backgroundColor: 'grey.200',
                position: 'relative'
            }}
        >
            {card ? (
                card.isFront ? (
                    <img src={card.imageUrl} alt="card" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                    <Paper
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#4A5568', // 뒷면 색상
                            borderRadius: '6px'
                        }}
                    >
                        <Typography color="white">뒷면</Typography>
                    </Paper>
                )
            ) : (
                <Typography color="text.secondary">{fieldNumber}</Typography>
            )}
        </Box>
    );
};

export default FieldSlot;
