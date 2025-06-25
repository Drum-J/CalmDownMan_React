import {useState, useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Chip, Grid
} from '@mui/material';
import api from '../common/axios';
import {ApiResponse} from "../common/ApiResponse.ts";

interface TradeCardDetail {
    cardId: number;
    title: string;
    grade: string;
    count: number;
    imageUrl: string;
}

interface TradeData {
    tradeId: number;
    title: string;
    content: string;
    nickname: string;
    tradeStatus: string;
}

export default function TradeDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const tradeData = location.state?.tradeData as TradeData;
    const [tradeCards, setTradeCards] = useState<TradeCardDetail[]>([]);

    useEffect(() => {
        const fetchTradeCards = async () => {
            try {
                // 카드 정보만 따로 가져오는 API 호출
                const response = await api.get<ApiResponse<TradeCardDetail[]>>(`/api/trade/${id}`);
                setTradeCards(response.data.data);
            } catch (error) {
                console.error('교환 카드 정보를 불러오는데 실패했습니다:', error);
            }
        };

        if (id) {
            fetchTradeCards();
        }
    }, [id]);

    if (!tradeData) {
        return <div>로딩 중...</div>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5">
                        {tradeData.title}
                    </Typography>
                    <Chip
                        label={tradeData.tradeStatus}
                        color={tradeData.tradeStatus === 'WAITING' ? 'primary' : 'default'}
                    />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    작성자: {tradeData.nickname}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    {tradeData.content}
                </Typography>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>교환 희망 카드</Typography>
            <Grid container spacing={2}>
                {tradeCards.map((card) => (
                    <Grid key={card.cardId} component="div"
                          sx={{
                              gridColumn: {
                                  xs: 'span 12',
                                  sm: 'span 6',
                                  md: 'span 3'
                              }
                          }}
                    >
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={card.imageUrl}
                                alt={card.title}
                                sx={{ objectFit: 'contain' }}
                            />
                            <CardContent>
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
        </Container>

    );
}