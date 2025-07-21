import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import api from '../common/axios';
import { useUser } from '../common/UserContext';
import CardGrid from "../components/card/CardGrid";
import {Card as CardDto} from "../components/card/dto";

const GameLobby = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useUser();
    const { selectedCards } = location.state || {};
    const [matchingStatus, setMatchingStatus] = useState('대기 중...');
    const [isMatching, setIsMatching] = useState(false);

    const battleCards: CardDto[] = [];
    for (const card of selectedCards) {
        battleCards.push({
            id: card.id,
            title: card.title,
            attackType: card.attackType,
            grade: card.grade,
            power: card.power,
            imageUrl: card.imageUrl,
            cardSeason: card.cardSeason
        });
    }

    useEffect(() => {
        if (!selectedCards || selectedCards.length !== 7) {
            alert('잘못된 접근입니다. 카드 선택 페이지로 돌아갑니다.');
            navigate('/selectCards', { state: { purpose: 'gameReady' } });
        }
    }, [selectedCards, navigate]);

    const handleMatchMaking = async () => {
        setIsMatching(true);
        setMatchingStatus('상대를 찾고 있습니다...');
        try {
            const cardIds = selectedCards.map(card => card.id);
            console.log('cardIds', cardIds);
            // 백엔드에 매칭 요청
            const response = await api.post('/game/matching/join', {
                userId: userInfo.id,
                cardIds: cardIds,
            });

            if (response.data.success) {
                const { roomId } = response.data.data;
                setMatchingStatus('매칭 성공! 게임을 시작합니다.');
                navigate(`/game/room/${roomId}`);
            } else {
                setMatchingStatus('매칭에 실패했습니다. 다시 시도해주세요.');
                setIsMatching(false);
            }
        } catch (error) {
            console.error('매칭 중 오류 발생:', error);
            setMatchingStatus('매칭 중 오류가 발생했습니다. 다시 시도해주세요.');
            setIsMatching(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    게임 대기실
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    선택한 7장의 카드로 게임을 시작할 준비가 되었습니다.
                </Typography>
                <CardGrid cards={battleCards} />
                {isMatching ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress sx={{ mr: 2 }} />
                        <Typography>{matchingStatus}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 1}}>
                        <Button variant="outlined" color="secondary" size="large" onClick={() => navigate('/selectCards', { state: { purpose: 'gameReady' } })}>
                            카드 다시 선택
                        </Button>
                        <Button variant="contained" color="primary" size="large" onClick={handleMatchMaking}>
                            매칭 시작
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default GameLobby;
