import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import api from '../common/axios';
import { ApiResponse } from '../common/ApiResponse';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
    GameInfoDto,
    FieldCardDto,
    MyGameCardDto,
    GameResultDto,
    SubmitMessageDto,
    BattleMessageDto
} from '../components/game/dto';
import FieldSlot from '../components/game/modules/FieldSlot';
import GameCardDetailModal from '../modal/GameCardDetailModal';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useRef } from 'react';

const GameRoom = () => {
    const { gameRoomId } = useParams<{ gameRoomId: string }>();
    const { userInfo } = useUser();
    const [gameInfo, setGameInfo] = useState<GameInfoDto | null>(null);
    const [isPlayer1, setIsPlayer1] = useState<boolean>(false);
    const [fieldCards, setFieldCards] = useState<Record<number, FieldCardDto | null>>(() => {
        const initialFields: Record<number, FieldCardDto | null> = {};
        for (let i = 1; i <= 6; i++) {
            initialFields[i] = null;
        }
        return initialFields;
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCardDetailModal, setShowCardDetailModal] = useState<boolean>(false);
    const [selectedCardForDetail, setSelectedCardForDetail] = useState<MyGameCardDto | null>(null);
    const stompClientRef = useRef<Client | null>(null); // WebSocket 클라이언트 참조 추가

    const handleCardClick = (card: MyGameCardDto) => {
        setSelectedCardForDetail(card);
        setShowCardDetailModal(true);
    };

    const handleFieldCardClick = (card: FieldCardDto) => {
        // FieldCardDto를 MyGameCardDto와 호환되는 형태로 변환
        const convertedCard: MyGameCardDto = {
            gameCardId: card.gameCardId,
            cardId: card.gameCardId, // FieldCardDto에는 cardId가 없으므로 gameCardId를 사용
            title: "Field Card", // FieldCardDto에는 title이 없으므로 임시 값 사용
            attackType: card.attackType,
            grade: card.grade,
            power: card.power,
            imageUrl: card.imageUrl,
        };
        setSelectedCardForDetail(convertedCard);
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
        if (gameInfo?.currentTurnPlayerId !== userInfo.id) {
            alert('내 턴이 아닙니다.');
            return;
        }
        try {
            const response = await api.post(`/game/${gameRoomId}/cardSubmit`, {
                playerId: userInfo.id,
                gameCardId: gameCardId,
            });

            if (response.data.status === 200) {
                console.log(`카드 ${gameCardId} 제출 성공!`);
            } else {
                console.error('카드 제출 실패:', response.data.message);
                alert(`카드 제출 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('카드 제출 중 오류 발생:', error);
            alert('카드 제출 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
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
                    setFieldCards(data.fieldCards);

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

        if (gameRoomId && userInfo?.id) {
            fetchGameInfo();
        }
    }, [gameRoomId, userInfo]);

    useEffect(() => {
        // WebSocket logic
        if (gameRoomId && userInfo?.id) {
            const socket = new SockJS('http://localhost:8080/ws-connection');
            const client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log('Connected to WebSocket in GameRoom');
                    stompClientRef.current = client;

                    // Subscribe to game result topic
                    client.subscribe(`/topic/game/${gameRoomId}`, (message) => {
                        const gameResult: GameResultDto = JSON.parse(message.body);
                        console.log('Game Result Received:', gameResult);
                        // TODO: 게임 결과 처리 로직 (예: 모달 띄우기, 게임 종료 처리)
                        alert(`게임 결과: ${gameResult.message}, 승자: ${gameResult.finalWinnerId ? gameResult.finalWinnerId : '무승부'}`);
                    });

                    // Subscribe to personal message queue
                    client.subscribe(`/queue/game/${gameRoomId}/${userInfo.id}`, (message) => {
                        const parsedMessage = JSON.parse(message.body);
                        console.log('Personal Message Received:', parsedMessage);

                        // SubmitMessageDto 처리
                        if (parsedMessage.myHandCards !== undefined) { // myHandCards가 있으면 SubmitMessageDto로 간주
                            const submitMessage: SubmitMessageDto = parsedMessage;
                            setFieldCards(submitMessage.fieldCards);
                            setGameInfo(prevGameInfo => {
                                if (!prevGameInfo) return null;
                                let updatedMyCards = prevGameInfo.myCards; // 기본적으로 기존 손패 유지
                                if (submitMessage.myHandCards !== null) { // myHandCards가 null이 아닐 때만 업데이트
                                    updatedMyCards = submitMessage.myHandCards;
                                }
                                return {
                                    ...prevGameInfo,
                                    myCards: updatedMyCards, // 조건부로 업데이트된 손패 사용
                                    currentTurnPlayerId: submitMessage.currentTurnPlayerId,
                                };
                            });
                            if (submitMessage.battleCardDto) {
                                console.log('배틀 발생!', submitMessage.battleCardDto);
                                // TODO: 배틀 애니메이션 또는 UI 처리
                            }
                        } 
                        // BattleMessageDto 처리
                        else if (parsedMessage.winnerId !== undefined) { // winnerId가 있으면 BattleMessageDto로 간주
                            const battleMessage: BattleMessageDto = parsedMessage;
                            setFieldCards(battleMessage.fieldCards);
                            setGameInfo(prevGameInfo => {
                                if (!prevGameInfo) return null;
                                return {
                                    ...prevGameInfo,
                                    currentTurnPlayerId: battleMessage.currentTurnPlayerId,
                                };
                            });
                            console.log('배틀 결과:', battleMessage.winnerId);
                            // TODO: 배틀 결과 UI 처리
                        }
                        // 기타 메시지 타입 처리 (필요하다면)
                        else {
                            console.warn('알 수 없는 개인 메시지 타입:', parsedMessage);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onDisconnect: () => {
                    console.log('Disconnected from WebSocket in GameRoom');
                }
            });
            client.activate();

            return () => {
                if (stompClientRef.current) {
                    stompClientRef.current.deactivate();
                    stompClientRef.current = null;
                }
            };
        }
    }, [gameRoomId, userInfo?.id]);

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
                    <FieldSlot
                        key={fieldNum}
                        fieldNumber={fieldNum}
                        card={fieldCards[fieldNum]}
                        isPlayer1={isPlayer1}
                        onClick={handleFieldCardClick} // Pass the new handler
                    />
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
                            referrerPolicy={"no-referrer"}
                            onClick={() => handleCardClick(card)}
                        />
                    ))}
                </Box>
            </Box>

            <GameCardDetailModal
                open={showCardDetailModal}
                onClose={handleCloseCardDetailModal}
                card={selectedCardForDetail}
                onSubmit={handleSubmitCard}
                isMyTurn={gameInfo?.currentTurnPlayerId === userInfo?.id}
                isFieldCard={selectedCardForDetail?.title === "Field Card"} // 필드 카드 여부 전달
            />
        </Box>
    );
};

export default GameRoom;
