import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function CardItem({ card }) {
    return (
        <Card sx={{borderRadius: 3 }}>
            <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
                height="350"
                referrerPolicy="no-referrer"
                sx={{ width: 245, objectFit: 'cover' }}
            />
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">{card.title}</Typography>
                <Typography variant="body2">등급: {card.grade}</Typography>
                <Typography variant="body2">파워: {card.power}</Typography>
                <Typography variant="body2">공격 타입: {card.attackType}</Typography>
                <Typography variant="body2" color="text.secondary">시즌: {card.cardSeason}</Typography>
            </CardContent>
        </Card>
    );
}
