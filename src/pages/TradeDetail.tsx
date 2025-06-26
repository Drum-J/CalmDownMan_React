import {useState, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
    Paper,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    Chip, Grid,
    Button
} from '@mui/material';
import api from '../common/axios';
import {ApiResponse} from "../common/ApiResponse";
import {TradeCardDetail, StatusOption, Trade, ListState} from '../components/trade/dto';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useUser} from "../common/UserContext";


export default function TradeDetail() {
    const { userInfo } = useUser();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const tradeData = location.state?.tradeData as Trade;
    const listState = location.state?.listState as ListState;
    const [tradeCards, setTradeCards] = useState<TradeCardDetail[]>([]);
    const [owner, setOwner] = useState<boolean>(false);

    const statusOptions: StatusOption[] = [
        { value: 'ALL', label: '전체' },
        { value: 'WAITING', label: '대기' },
        { value: 'COMPLETED', label: '완료' },
        { value: 'REJECTED', label: '거절' },
        { value: 'CANCEL', label: '취소' }
    ];

    const getStatusLabel = (status: string): string => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption ? statusOption.label : status;
    };

    useEffect(() => {
        const fetchTradeCards = async () => {
            try {
                // 카드 정보만 따로 가져오는 API 호출
                const response = await api.get<ApiResponse<TradeCardDetail[]>>(`/trade/${id}`);
                setTradeCards(response.data.data);
            } catch (error) {
                console.error('교환 카드 정보를 불러오는데 실패했습니다:', error);
            }
        };

        if (id) {
            fetchTradeCards();
        }

        if (userInfo !== null) {
            userInfo.id === tradeData.accountId ? setOwner(true) : setOwner(false);
        }
    }, [id]);

    if (!tradeData) {
        return <div>로딩 중...</div>;
    }

    const handleBack = () => {
        navigate('/trade', {
            state: {
                listState: listState
            }
        });
    };

    const handleTradeRequest = () => {
        navigate('/selectCards', {
            state: {
                purpose: 'tradeRequest',
                trade: tradeData,
                listState: listState
            }
        });
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4">
                        {tradeData.title}
                    </Typography>
                    <Chip
                        sx={{ ml: 2 }}
                        label={getStatusLabel(tradeData.tradeStatus)}
                        color={tradeData.tradeStatus === 'WAITING' ? 'primary' : 'secondary'}
                    />

                    {owner && tradeData.tradeStatus === 'WAITING' &&
                        <Chip
                            label={'교환 취소하기'}
                            color={'error'}
                            sx={{cursor: 'pointer', ml: 2, '&:hover': {backgroundColor: 'rgba(246, 104, 94, 1)'}}}
                        />
                    }
                </Box>

                <Typography align={'right'} variant="subtitle1" color="text.secondary" sx={{ mb: 2}}>
                    작성자: {tradeData.nickname}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                    {tradeData.content}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2 }}>⭐교환 등록 카드⭐</Typography>
                <Grid container justifyContent={'center'} spacing={2}>
                    {tradeCards.map((card) => (
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

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    목록으로 돌아가기
                </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h4">
                    교환 신청 목록
                </Typography>

                {!owner && tradeData.tradeStatus === 'WAITING' &&
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        sx={{mt:2}}
                        onClick={handleTradeRequest}
                    >
                        교환 신청하기
                    </Button>
                }
            </Paper>
        </Box>
    );
}