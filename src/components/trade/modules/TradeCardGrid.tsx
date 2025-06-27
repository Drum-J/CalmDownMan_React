import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { TradeCardDetail } from '../dto';

interface TradeCardGridProps {
    cards: TradeCardDetail[];
}

export default function TradeCardGrid({ cards }: TradeCardGridProps) {
    return (
        <Grid container justifyContent={'center'} spacing={2}>
            {cards.map((card) => (
                <Grid key={card.cardId}>
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
                            <Typography gutterBottom variant="h6">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                등급: {card.grade}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                수량: {card.count}개
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}