import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import api from '../common/axios';
import { ApiResponse } from '../common/ApiResponse';
import { Box, CircularProgress, Typography } from '@mui/material';
import { GameInfoDto, FieldCardDto, MyGameCardDto } from '../components/game/dto';
import FieldSlot from '../components/game/modules/FieldSlot';
import GameCardDetailModal from '../modal/GameCardDetailModal';

const GameRoom = () => {
    const location = useLocation();
    const gameRoomId = location.state?.gameRoomId;
    const { userInfo } = useUser();
    const [gameInfo, setGameInfo] = useState<GameInfoDto | null>(null);
    const [isPlayer1, setIsPlayer1] = useState<boolean>(false);
    const [fieldCards, setFieldCards] = useState<Record<number, FieldCardDto | null>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCardDetailModal, setShowCardDetailModal] = useState<boolean>(false);
    const [selectedCardForDetail, setSelectedCardForDetail] = useState<MyGameCardDto | null>(null);

    const handleCardClick = (card: MyGameCardDto) => {
        setSelectedCardForDetail(card);
        setShowCardDetailModal(true);
    };

    const handleCloseCardDetailModal = () => {
        setShowCardDetailModal(false);
        setSelectedCardForDetail(null);
    };

    const handleSubmitCard = async (gameCardId: number) => {
        if (!userInfo || !gameRoomId) {
            console.error('유저 정보 또는 게임방 ID가 없습니다.');
            return;
        }
        try {
            // TODO: 백엔드 API 호출 (카드 제출)
            console.log(`카드 제출: gameCardId = ${gameCardId}, gameRoomId = ${gameRoomId}, playerId = ${userInfo.id}`);
            // 예시: await api.post(`/game/${gameRoomId}/submit-card`, { playerId: userInfo.id, gameCardId: gameCardId });
            alert(`카드 ${gameCardId} 제출! (실제 API 호출은 아직 구현되지 않았습니다.)`);
        } catch (error) {
            console.error('카드 제출 중 오류 발생:', error);
            alert('카드 제출 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        // Initialize fields 1 through 6
        const initialFields: Record<number, FieldCardDto | null> = {};
        for (let i = 1; i <= 6; i++) {
            initialFields[i] = null;
        }
        setFieldCards(initialFields);

        const fetchGameInfo = async () => {
            if (!gameRoomId || !userInfo) {
                setError('잘못된 접근입니다. 게임방 ID가 없거나 유저 정보가 없습니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get<ApiResponse<GameInfoDto>>(`/game/${gameRoomId}`);

                if (response.data.status === 200 && response.data.data) {
                    const data = response.data.data;
                    setGameInfo(data);

                    if (userInfo.id === data.player1Id) {
                        setIsPlayer1(true);
                    } else if (userInfo.id === data.player2Id) {
                        setIsPlayer1(false);
                    } else {
                        setError("유효하지 않은 플레이어입니다.");
                    }
                } else {
                    setError(response.data.message || '게임 정보를 불러오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('게임 정보 로딩 중 오류 발생:', err);
                setError('게임 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchGameInfo();
    }, [gameRoomId, userInfo]);

    // TODO: WebSocket logic to update fieldCards state from SubmitMessage

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>게임 정보를 불러오는 중...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (!gameInfo) {
        return <Typography>게임 정보를 찾을 수 없습니다.</Typography>;
    }

    const fieldNumbers = [1, 2, 3, 4, 5, 6];

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>Game Room</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px' }}>
                <Typography variant="h6">
                    내 필드: {isPlayer1 ? '블루' : '레드'}
                </Typography>
                <Typography variant="h5">상대: {gameInfo.otherPlayer}</Typography>
                <Typography variant="h6">
                    현재 턴: {gameInfo.currentTurnPlayerId === userInfo?.id ? '나' : '상대'}
                </Typography>
            </Box>

            {/* Game Board */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, p: 2, backgroundColor: 'grey.100', borderRadius: 2 }}>
                {fieldNumbers.map(fieldNum => (
                    <FieldSlot key={fieldNum} fieldNumber={fieldNum} card={fieldCards[fieldNum]} isPlayer1={isPlayer1} />
                ))}
            </Box>

            <Box mt={4}>
                <Typography variant="h6">내 카드:</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {gameInfo.myCards.map((card) => (
                        <img
                            key={card.gameCardId}
                            src={card.imageUrl}
                            alt={card.title}
                            style={{ width: 100, cursor: 'pointer' }}
                            onClick={() => handleCardClick(card)}
                        />
                    ))}
                </Box>
            </Box>

            <CardDetailModal
                open={showCardDetailModal}
                onClose={handleCloseCardDetailModal}
                card={selectedCardForDetail}
                onSubmit={handleSubmitCard}
            />
        </Box>
    );
};

export default GameRoom;
