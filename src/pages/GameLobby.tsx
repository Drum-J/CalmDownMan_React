import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import CardGrid from "../components/card/CardGrid";
import {Card as CardDto} from "../components/card/dto";
import GameMatchingModal from "../modal/GameMatchingModal"; // GameMatchingModal 임포트

const GameLobby = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCards } = location.state || {};
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태

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

    // 초기 카드 선택 유효성 검사
    useEffect(() => {
        if (!selectedCards || selectedCards.length !== 7) {
            alert('잘못된 접근입니다. 카드 선택 페이지로 돌아갑니다.');
            navigate('/selectCards', { state: { purpose: 'gameReady' } });
        }
    }, [selectedCards, navigate]);

    const handleMatchStart = () => {
        setIsModalOpen(true); // 매칭 시작 버튼 클릭 시 모달 열기
    };

    const handleMatchSuccess = useCallback((roomId: string) => {
        setIsModalOpen(false); // 매칭 성공 시 모달 닫기
        navigate('/game/room', { state: { gameRoomId: roomId } });
    }, [navigate]);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false); // 모달 닫기
    }, []);

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
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 1}}>
                    <Button variant="outlined" color="secondary" size="large" onClick={() => navigate('/selectCards', { state: { purpose: 'gameReady' } })}>
                        카드 다시 선택
                    </Button>
                    <Button variant="contained" color="primary" size="large" onClick={handleMatchStart}>
                        매칭 시작
                    </Button>
                </Box>
            </Box>

            {/* GameMatchingModal 렌더링 */}
            <GameMatchingModal
                open={isModalOpen}
                onClose={handleModalClose}
                onMatchSuccess={handleMatchSuccess}
                selectedCards={selectedCards}
            />
        </Box>
    );
};

export default GameLobby;
