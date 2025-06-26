import { useState, useEffect, useMemo } from 'react';
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
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem, SelectChangeEvent
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import api from '../common/axios';
import { ApiResponse } from "../common/ApiResponse";
import {ListState, Trade} from "../components/trade/dto";

// API 응답에 대한 DTO
interface MyCardDetailDto {
    id: number;
    title: string;
    attackType: string;
    grade: string;
    power: number;
    imageUrl: string;
    cardSeason: string;
    count: number; // 보유 수량
}

// 선택된 카드의 수량을 저장하기 위한 타입
type SelectedCards = {
    [key: number]: number;
};

// 페이지의 목적을 정의
type PagePurpose = 'tradePost' | 'tradeRequest' | 'gameReady';

interface LocationState {
    purpose: PagePurpose;
    trade?: Trade;
    listState?: ListState;
}

export default function SelectCardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    useEffect(() => {
        if (!state?.purpose) {
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/');
        }
    }, [state, navigate]);

    const { purpose, trade, listState } = state || {};

    const [myCards, setMyCards] = useState<MyCardDetailDto[]>([]);
    const [selectedCards, setSelectedCards] = useState<SelectedCards>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        cardSeason: 'ALL',
        grade: 'ALL',
        attackType: 'ALL',
    });

    const pageTexts = {
        'tradePost': { title: '교환에 등록할 카드 선택', submitButton: '다음 (글 작성하기)' },
        'tradeRequest': { title: '교환 신청할 카드 선택', submitButton: '교환 신청하기' },
        'gameReady': { title: '게임에 사용할 카드 선택', submitButton: '선택 완료' }
    };

    useEffect(() => {
        const fetchMyCards = async () => {
            setLoading(true);
            try {
                const response = await api.get<ApiResponse<MyCardDetailDto[]>>('/card/mine');
                setMyCards(response.data.data);
                const initialSelection: SelectedCards = {};
                response.data.data.forEach(card => {
                    initialSelection[card.id] = 0;
                });
                setSelectedCards(initialSelection);
            } catch (error) {
                console.error('내 카드 정보를 불러오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        if (purpose) fetchMyCards();
    }, [purpose]);

    // 필터 옵션을 myCards 데이터로부터 동적으로 생성
    const filterOptions = useMemo(() => {
        const seasons = new Set<string>();
        const grades = new Set<string>();
        const attackTypes = new Set<string>();
        myCards.forEach(card => {
            seasons.add(card.cardSeason);
            grades.add(card.grade);
            attackTypes.add(card.attackType);
        });
        return {
            cardSeason: ['ALL', ...Array.from(seasons)],
            grade: ['ALL', ...Array.from(grades)],
            attackType: ['ALL', ...Array.from(attackTypes)],
        };
    }, [myCards]);

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // 필터링된 카드 목록
    const filteredCards = useMemo(() => {
        return myCards.filter(card => {
            const seasonMatch = filters.cardSeason === 'ALL' || card.cardSeason === filters.cardSeason;
            const gradeMatch = filters.grade === 'ALL' || card.grade === filters.grade;
            const attackTypeMatch = filters.attackType === 'ALL' || card.attackType === filters.attackType;
            return seasonMatch && gradeMatch && attackTypeMatch;
        });
    }, [myCards, filters]);

    const handleQuantityChange = (cardId: number, maxCount: number, change: 1 | -1) => {
        setSelectedCards(prev => {
            const newQuantity = (prev[cardId] || 0) + change;
            return newQuantity >= 0 && newQuantity <= maxCount ? { ...prev, [cardId]: newQuantity } : prev;
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true); // API 호출 시작 시 버튼 비활성화

        try {
            // 교환 신청 로직
            if (purpose === 'tradeRequest') {
                const selectedCardIds: number[] = [];
                for (const cardId in selectedCards) {
                    const quantity = selectedCards[cardId];
                    if (quantity > 0) {
                        for (let i = 0; i < quantity; i++) {
                            selectedCardIds.push(Number(cardId));
                        }
                    }
                }

                // 백엔드 API 호출
                const response = await api.post<ApiResponse<string>>(
                    `/trade/request/${trade.tradeId}`,
                    { cardIds: selectedCardIds }  // DTO에 맞게 데이터 전송
                );

                // 성공 시 서버의 응답 메시지를 alert으로 표시
                alert(response.data.data);
                navigate(`/trade/${trade.tradeId}`, {
                    state: {
                        tradeData: trade,
                        listState: listState
                    }
                });
                return; // 교환 신청 로직은 여기서 종료
            }

            // 교환 등록 및 게임 준비 로직 (이 부분은 기존과 동일합니다)
            const selectedCardsDetails: MyCardDetailDto[] = [];
            for (const cardIdStr in selectedCards) {
                const cardId = Number(cardIdStr);
                const quantity = selectedCards[cardId];
                if (quantity > 0) {
                    const cardInfo = myCards.find(c => c.id === cardId);
                    if (cardInfo) {
                        for (let i = 0; i < quantity; i++) {
                            selectedCardsDetails.push(cardInfo);
                        }
                    }
                }
            }

            if (purpose === 'tradePost') {
                navigate('/trade/new', { state: { selectedCards: selectedCardsDetails } });
            } else if (purpose === 'gameReady') {
                navigate('/game/lobby', { state: { selectedCards: selectedCardsDetails } });
            }

        } catch (error) {
            console.error('요청 처리 중 오류가 발생했습니다:', error);
            alert('요청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false); // API 호출 종료 시 버튼 다시 활성화
        }
    };

    const totalSelectedCount = Object.values(selectedCards).reduce((sum, count) => sum + count, 0);

    if (loading || !purpose) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mt: 4, pb: '150px' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                    {pageTexts[purpose]?.title}
                </Typography>

                {/* 필터링 UI */}
                <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                    <Grid container spacing={2} alignItems="center">
                        <Grid>
                            <FormControl fullWidth size="small">
                                <InputLabel>시즌</InputLabel>
                                <Select name="cardSeason" value={filters.cardSeason} label="시즌" onChange={handleFilterChange}
                                        MenuProps={{ disableScrollLock: true }}
                                >
                                    {filterOptions.cardSeason.map(s => <MenuItem key={s} value={s}>{s === 'ALL' ? '전체 시즌' : s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl fullWidth size="small">
                                <InputLabel>등급</InputLabel>
                                <Select name="grade" value={filters.grade} label="등급" onChange={handleFilterChange}
                                        MenuProps={{ disableScrollLock: true }}
                                >
                                    {filterOptions.grade.map(g => <MenuItem key={g} value={g}>{g === 'ALL' ? '전체 등급' : g}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl fullWidth size="small">
                                <InputLabel>공격 타입</InputLabel>
                                <Select name="attackType" value={filters.attackType} label="공격 타입" onChange={handleFilterChange}
                                        MenuProps={{ disableScrollLock: true }}
                                >
                                    {filterOptions.attackType.map(t => <MenuItem key={t} value={t}>{t === 'ALL' ? '전체 타입' : t}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid container justifyContent={'center'} spacing={2}>
                    {filteredCards.map((card) => (
                        <Grid key={card.id}>
                            <Card sx={{ borderRadius: 3, outline:'blue' }}>
                                <CardMedia
                                    component="img"
                                    image={card.imageUrl}
                                    alt={card.title}
                                    height="350"
                                    referrerPolicy="no-referrer"
                                    sx={{width: 245, objectFit: 'cover'}}
                                />
                                <CardContent sx={{ textAlign: 'center', backgroundColor:'#282831' }}>
                                    <Typography gutterBottom variant="h6" sx={{ height: '3rem' }}>{card.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">보유 수량: {card.count}개</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                                        <IconButton onClick={() => handleQuantityChange(card.id, card.count, -1)} disabled={(selectedCards[card.id] || 0) === 0}>
                                            <RemoveCircleOutlineIcon />
                                        </IconButton>
                                        <Typography sx={{ mx: 2, width: '20px' }}>{selectedCards[card.id] || 0}</Typography>
                                        <IconButton onClick={() => handleQuantityChange(card.id, card.count, 1)} disabled={(selectedCards[card.id] || 0) >= card.count}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {filteredCards.length === 0 && !loading && (
                        <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                            조건에 맞는 카드가 없습니다.
                        </Typography>
                    )}
                </Grid>
            </Paper>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, textAlign: 'center', zIndex: 1100, borderTop: '1px solid #444' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>총 선택된 카드: {totalSelectedCount}장</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => window.history.back()}
                >
                    취소
                </Button>
                <Button variant="contained" color="primary" size="large"
                        onClick={handleSubmit}
                        disabled={totalSelectedCount === 0 || isSubmitting}
                >
                    {pageTexts[purpose]?.submitButton}
                </Button>
            </Paper>
        </Box>
    );
}