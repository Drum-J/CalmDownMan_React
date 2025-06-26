import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import {JSX} from "react";
import {Card as CardDto} from "./dto";

interface CardItemProps {
    card: CardDto;
}

export default function CardItem({card}: CardItemProps): JSX.Element {
    return (
        <Card sx={{borderRadius: 3}}>
            <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
                height="350"
                referrerPolicy="no-referrer"
                sx={{width: 245, objectFit: 'cover'}}
            />
            <CardContent sx={{ backgroundColor:'#282831' }}>
                <Typography variant="subtitle1" fontWeight="bold">{card.title}</Typography>
                <Typography variant="body2">등급: {card.grade}</Typography>
                <Typography variant="body2">파워: {card.power}</Typography>
                <Typography variant="body2">공격 타입: {card.attackType}</Typography>
                <Typography variant="body2" color="text.secondary">시즌: {card.cardSeason}</Typography>
            </CardContent>
        </Card>
    );
};
