import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import {JSX} from "react";
import {Card as CardDto} from "./dto";

interface CardItemProps {
    card: CardDto;
}

export default function CardItem({card}: CardItemProps): JSX.Element {
    // MyCards 페이지에서만 count가 정의되므로, 이를 통해 분기합니다.
    const isMyCardsView = card.count !== undefined;

    // isMyCardsView일 경우에만 소유 여부를 확인합니다.
    const isOwned = isMyCardsView && card.count > 0;

    // isMyCardsView이고, 소유하지 않은 카드에만 흑백 스타일을 적용합니다.
    const applyUnownedStyle = isMyCardsView && !isOwned;

    return (
        <Card sx={{borderRadius: 3, position: 'relative'}}>
            {isOwned && ( // 소유한 카드에만 개수 표시
                <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    {card.count}
                </Box>
            )}
            <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
                height="350"
                referrerPolicy="no-referrer"
                sx={{
                    width: 245,
                    objectFit: 'cover',
                    filter: applyUnownedStyle ? 'grayscale(100%)' : 'none'
                }}
            />
            <CardContent sx={{ backgroundColor: applyUnownedStyle ? '#555' : '#282831' }}>
                <Typography variant="subtitle1" fontWeight="bold">{card.title}</Typography>
                <Typography variant="body2">등급: {card.grade}</Typography>
                <Typography variant="body2">파워: {card.power}</Typography>
                <Typography variant="body2">공격 타입: {card.attackType}</Typography>
                <Typography variant="body2" color="text.secondary">시즌: {card.cardSeason}</Typography>
            </CardContent>
        </Card>
    );
};