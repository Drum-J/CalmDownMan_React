import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, IconButton, CircularProgress, Card } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../../common/axios';
import { Card as CardType } from '../../components/card/dto';
import CardItem from '../../components/card/CardItem';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // CardDex에서 사용하는 카드 아이템 재사용

interface SeasonInfo {
    id: number;
    title: string;
}

export default function SeasonCardListPage() {
    const { seasonId } = useParams<{ seasonId: string }>();
    const navigate = useNavigate();
    const [cards, setCards] = useState<CardType[]>([]);
    const [seasonInfo, setSeasonInfo] = useState<SeasonInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cardSize, setCardSize] = useState(0);

    useEffect(() => {
        if (!seasonId) return;

        const fetchCards = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<{ data: CardType[] }>(`/card/season/${seasonId}`);
                const cardData = response.data.data;
                setCards(cardData);
                setCardSize(cardData.length);
                // 시즌 정보 설정 (첫 번째 카드의 시즌 정보를 사용하거나, 별도 API 호출)
                if (cardData.length > 0) {
                    setSeasonInfo({ id: Number(seasonId), title: cardData[0].cardSeason });
                }

            } catch (error) {
                console.error("시즌 카드 목록을 불러오는 데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();
    }, [seasonId]);

    const handleAddCardClick = () => {
        navigate(`/admin/cards/seasons/${seasonId}/new`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <IconButton onClick={() => navigate('/admin/cards')} sx={{ mr: 1 }}>
                    <ArrowBackIcon sx={{ blockSize:'', color: 'grey.500'}} />
                </IconButton>
                <Typography variant="h4">
                    {seasonInfo?.title || '시즌 카드 관리'} - 총 {cardSize || 0}종
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* 새 카드 추가 버튼 */}
                <Grid>
                    <Paper
                        variant="outlined"
                        sx={{
                            width: 245,
                            height: '100%',
                            minHeight: 350, // CardItem 높이와 유사하게 설정
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: '2px',
                            borderColor: 'grey.500',
                            cursor: 'pointer',
                            "&:hover": { backgroundColor: 'grey.100' }
                        }}
                        onClick={handleAddCardClick}
                    >
                        <IconButton color="primary" sx={{ width: 80, height: 80 }}>
                            <AddIcon sx={{ fontSize: 50 }} />
                        </IconButton>
                    </Paper>
                </Grid>

                {/* 카드 목록 */}
                {cards.map((card) => (
                    <Grid key={card.id}>
                        <CardItem card={card} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
