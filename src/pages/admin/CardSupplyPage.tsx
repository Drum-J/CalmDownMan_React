import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    IconButton,
    Paper,
    CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import api from '../../common/axios';
import { ApiResponse } from "../../common/ApiResponse";
import { UserInfo } from "../../common/UserContext";

// 카드 정보 DTO
interface CardDto {
    id: number;
    title: string;
    attackType: string;
    grade: string;
    power: number;
    imageUrl: string;
    cardSeason: string;
}

// 선택된 카드의 수량을 저장하기 위한 타입
type SelectedCards = {
    [key: number]: number;
};

interface LocationState {
    user: UserInfo;
}

export default function CardSupplyPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const user = state?.user;

    const [allCards, setAllCards] = useState<CardDto[]>([]);
    const [ownedCardIds, setOwnedCardIds] = useState<Set<number>>(new Set());
    const [selectedCards, setSelectedCards] = useState<SelectedCards>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            alert("잘못된 접근입니다. 사용자 관리 페이지로 이동합니다.");
            navigate('/admin/users');
        } else {
            fetchCardData();
        }
    }, [user, navigate]);

    const fetchCardData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 전체 카드와 유저 보유 카드를 동시에 요청
            const [allCardsResponse, ownedCardsResponse] = await Promise.all([
                api.get<ApiResponse<CardDto[]>>('/card'),
                api.get<ApiResponse<CardDto[]>>(`/card/account/${user.id}`)
            ]);

            const allCardsData = allCardsResponse.data.data;
            const ownedCardsData = ownedCardsResponse.data.data;

            setAllCards(allCardsData);

            // 보유 여부 판단을 위해 ID만 Set으로 저장 (count 등 다른 정보는 무시)
            const ownedIds = new Set(ownedCardsData.map(card => card.id));
            setOwnedCardIds(ownedIds);

            const initialSelection: SelectedCards = {};
            allCardsData.forEach(card => {
                initialSelection[card.id] = 0;
            });
            setSelectedCards(initialSelection);

        } catch (error) {
            console.error('카드 정보를 불러오는데 실패했습니다:', error);
            alert('카드 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (cardId: number, change: 1 | -1) => {
        setSelectedCards(prev => {
            const newQuantity = (prev[cardId] || 0) + change;
            return newQuantity >= 0 ? { ...prev, [cardId]: newQuantity } : prev;
        });
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const selectedItems = Object.entries(selectedCards)
            .filter(([, quantity]) => quantity > 0)
            .map(([cardId, quantity]) => {
                const card = allCards.find(c => c.id === Number(cardId));
                return { ...card, quantity };
            });

        if (selectedItems.length === 0) {
            alert("지급할 카드를 하나 이상 선택해주세요.");
            setIsSubmitting(false);
            return;
        }

        navigate('/admin/cardSupplyConfirm', {
            state: {
                user: user,
                selectedCards: selectedItems
            }
        });
    };

    const totalSelectedCount = Object.values(selectedCards).reduce((sum, count) => sum + count, 0);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mt: 4, pb: '150px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                    {user?.nickname}님에게 지급할 카드를 선택해 주세요.
                </Typography>

                <Grid container justifyContent={'center'} spacing={2}>
                    {allCards.map((card) => {
                        const isOwned = ownedCardIds.has(card.id);
                        return (
                            <Grid key={card.id}>
                                <Card sx={{ borderRadius: 3, width: 245 }}>
                                    <CardMedia
                                        component="img"
                                        image={card.imageUrl}
                                        alt={card.title}
                                        height="350"
                                        referrerPolicy="no-referrer"
                                        sx={{
                                            objectFit: 'cover',
                                            filter: isOwned ? 'none' : 'grayscale(100%)' // 보유 여부에 따라 grayscale 필터 적용
                                        }}
                                    />
                                    <CardContent sx={{ textAlign: 'center', backgroundColor: '#282831' }}>
                                        <Typography gutterBottom variant="h6" sx={{ height: '3rem' }}>{card.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                                            <IconButton onClick={() => handleQuantityChange(card.id, -1)} disabled={(selectedCards[card.id] || 0) === 0}>
                                                <RemoveCircleOutlineIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 2, width: '20px' }}>{selectedCards[card.id] || 0}</Typography>
                                            <IconButton onClick={() => handleQuantityChange(card.id, 1)}>
                                                <AddCircleOutlineIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}
                    {allCards.length === 0 && !loading && (
                        <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                            등록된 카드가 없습니다.
                        </Typography>
                    )}
                </Grid>
            </Paper>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, textAlign: 'center', zIndex: 1100, borderTop: '1px solid #444' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>총 선택된 카드: {totalSelectedCount}장</Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ mr: 2 }}
                >
                    취소
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting || totalSelectedCount === 0}
                >
                    다음
                </Button>
            </Paper>
        </Box>
    );
}
