import { Box, Paper, Typography } from "@mui/material";
import { FieldCardDto } from "../dto";

interface FieldSlotProps {
    fieldNumber: number;
    card: FieldCardDto | null;
    isPlayer1: boolean;
    onClick?: (card: FieldCardDto) => void; // Add onClick prop
}

const FieldSlot = ({ fieldNumber, card, isPlayer1, onClick }: FieldSlotProps) => {
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
                position: 'relative',
                cursor: (card && (card.isMine || card.isFront)) ? 'pointer' : 'default' // 내 카드이거나 앞면 카드일 때만 커서 변경
            }}
            onClick={() => { // Box에 onClick 적용
                if (card && (card.isMine || card.isFront) && onClick) {
                    onClick(card);
                }
            }}
        >
            {card ? (
                card.isFront ? (
                    <img
                        src={card.imageUrl}
                        alt="card"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                    />
                ) : (
                    <img
                        src="https://chimonca.s3.ap-northeast-2.amazonaws.com/cardBack.png"
                        alt="card back"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                    />
                )
            ) : (
                <Typography color="text.secondary">{fieldNumber}</Typography>
            )}
        </Box>
    );
};

export default FieldSlot;
