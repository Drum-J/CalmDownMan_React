import { useEffect, useState, useRef } from 'react';
import { useBlocker, useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import api from '../common/axios';
import { ApiResponse } from '../common/ApiResponse';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {
    GameInfoDto,
    FieldCardDto,
    MyGameCardDto,
    GameResultDto,
    SubmitMessageDto,
    BattleMessageDto,
    BattleCardDto, SurrenderMessageDto,
} from '../components/game/dto';
import FieldSlot from '../components/game/modules/FieldSlot';
import GameCardDetailModal from '../modal/GameCardDetailModal';
import BattleModal from '../modal/BattleModal';
import GameResultModal from '../modal/GameResultModal';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ConfirmModal from "../modal/ConfirmModal";
import TurnTimer from "../components/game/modules/TurnTimer";
import usePreventLeave from "../hooks/usePreventLeave";

const GameRoom = () => {
    const { gameRoomId } = useParams<{ gameRoomId: string }>();
    const { userInfo, refreshUserInfo } = useUser();
    const navigate = useNavigate();
    const [gameInfo, setGameInfo] = useState<GameInfoDto | null>(null);
    const [isPlayer1, setIsPlayer1] = useState<boolean>(false);
    const [fieldCards, setFieldCards] = useState<Record<number, FieldCardDto | null>>(() => {
        const initialFields: Record<number, FieldCardDto | null> = {};
        for (let i = 1; i <= 6; i++) {
            initialFields[i] = null;
        }
        return initialFields;
    });
    const fieldCardsRef = useRef(fieldCards);

    useEffect(() => {
        fieldCardsRef.current = fieldCards;
    }, [fieldCards]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCardDetailModal, setShowCardDetailModal] = useState<boolean>(false);
    const [selectedCardForDetail, setSelectedCardForDetail] = useState<MyGameCardDto | null>(null);
    const [isBattleInProgress, setIsBattleInProgress] = useState<boolean>(false);
    const [showBattleModal, setShowBattleModal] = useState<boolean>(false);
    const [battleCard1ImageUrl, setBattleCard1ImageUrl] = useState<string | null>(null);
    const [battleCard2ImageUrl, setBattleCard2ImageUrl] = useState<string | null>(null);
    const [battleResultWinnerId, setBattleResultWinnerId] = useState<number | null>(null);
    const [showGameResultModal, setShowGameResultModal] = useState<boolean>(false);
    const [gameWinnerId, setGameWinnerId] = useState<number | null>(null);
    const [showSurrenderConfirmModal, setShowSurrenderConfirmModal] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(90);
    const stompClientRef = useRef<Client | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { enablePrevent, disablePrevent } = usePreventLeave(
        "페이지를 벗어나면 게임에서 패배 처리될 수 있습니다. 정말로 이동하시겠습니까?"
    );

    // React Router 이탈 방지
    const blocker = useBlocker(!showGameResultModal);

    useEffect(() => {
        return () => {
            if (blocker.state === "blocked") {
                blocker.proceed();
            }
        };
    }, [blocker]);

    const handleExitGame = async () => {
        disablePrevent();
        if (blocker && blocker.state === 'blocked') {
            blocker.proceed();
        }
        await refreshUserInfo();
        navigate('/');
    };

    const handleConfirmNavigation = async () => {
        if (blocker.state === 'blocked') {
            if (userInfo && gameRoomId) {
                try {
                    await api.post(`/game/${gameRoomId}/surrender`, { playerId: userInfo.id });
                } catch (error) {
                    console.error('항복 처리 중 오류 발생 (페이지 이탈):', error);
                }
            }
            disablePrevent(); // 브라우저 이탈 방지 비활성화
            blocker.proceed();
        }
    };

    const handleCancelNavigation = () => {
        if (blocker.state === 'blocked') {
            blocker.reset();
        }
    };


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
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (!userInfo || !gameRoomId) {
            console.error('유저 정보 또는 게임방 ID가 없습니다.');
            return;
        }
        if (gameInfo?.currentTurnPlayerId !== userInfo.id) {
            alert('내 턴이 아닙니다.');
            return;
        }

        const fieldCardCount = Object.values(fieldCardsRef.current).filter(card => card !== null).length;
        console.log(fieldCardCount);
        if (fieldCardCount >= 6) {
            alert('필드가 가득 찼습니다. 더 이상 카드를 제출할 수 없습니다.');
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

    const handleSurrender = () => {
        setShowSurrenderConfirmModal(true);
    };

    const handleConfirmSurrender = async () => {
        if (!userInfo || !gameRoomId) {
            console.error('유저 정보 또는 게임방 ID가 없습니다.');
            return;
        }
        try {
            console.log("surrender ", userInfo.id);
            await api.post(`/game/${gameRoomId}/surrender`, { playerId: userInfo.id });
            // 성공 시 별도 처리 없음. WebSocket을 통해 결과가 전달될 것임.
        } catch (error) {
            console.error('항복 처리 중 오류 발생:', error);
            alert('항복 처리 중 오류가 발생했습니다.');
        }
        setShowSurrenderConfirmModal(false);
    };

    const handleFieldBattleClick = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (!userInfo || !gameRoomId || !gameInfo) {
            console.error('유저 정보, 게임방 ID 또는 게임 정보가 없습니다.');
            return;
        }
        if (gameInfo.currentTurnPlayerId !== userInfo.id) {
            alert('내 턴이 아닙니다.');
            return;
        }

        const response = await api.post(`/game/${gameRoomId}/fieldBattle`, {
            playerId: userInfo.id,
        });

        if (response.status === 200) {
            console.log('배틀 요청 성공!');
            // 배틀 결과는 WebSocket을 통해 BattleMessageDto로 수신됩니다.
        } else {
            console.error('배틀 요청 실패:', response.data.message);
            alert(`배틀 요청 실패: ${response.data.message}`);
        }
    };

    const handleBattle = async (battleCardDto: BattleCardDto) => {
        if (!gameRoomId || !userInfo) {
            console.error('유저 정보 또는 게임방 ID가 없습니다.');
            return;
        }
        try {
            const response = await api.post(`/game/${gameRoomId}/battle`, {
                gameCardId1: battleCardDto.gameCardId1,
                gameCardId2: battleCardDto.gameCardId2,
                playerId: userInfo.id // 배틀을 요청하는 플레이어 ID
            });

            if (response.status === 200) {
                console.log('배틀 요청 성공!');
                // 배틀 결과는 WebSocket을 통해 BattleMessageDto로 수신됩니다.
            } else {
                console.error('배틀 요청 실패:', response.data.message);
                alert(`배틀 요청 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('배틀 요청 중 오류 발생:', error);
            alert('배틀 요청 중 오류가 발생했습니다.');
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
                            if (submitMessage.gameWinnerId !== null) { // 카드 제출 후 모든 필드를 차지한 경우
                                setGameWinnerId(submitMessage.gameWinnerId);
                                setShowGameResultModal(true);
                            } else if (submitMessage.battleCardDto) {
                                console.log('배틀 발생!', submitMessage.battleCardDto);
                                setIsBattleInProgress(true); // 배틀 시작
                                setShowBattleModal(true); // 배틀 모달 열기
                                setBattleResultWinnerId(null); // 이전 배틀 결과 초기화

                                // 필드 카드에서 이미지 URL 가져오기
                                const card1 = Object.values(submitMessage.fieldCards).find(card => card?.gameCardId === submitMessage.battleCardDto?.gameCardId1);
                                const card2 = Object.values(submitMessage.fieldCards).find(card => card?.gameCardId === submitMessage.battleCardDto?.gameCardId2);

                                setBattleCard1ImageUrl(card1?.imageUrl || null);
                                setBattleCard2ImageUrl(card2?.imageUrl || null);

                                // 현재 턴 플레이어만 배틀 API를 호출하도록 조건 추가
                                if (userInfo?.id === submitMessage.currentTurnPlayerId) {
                                    handleBattle(submitMessage.battleCardDto); // 배틀 API 호출
                                }
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
                            setGameWinnerId(battleMessage.gameWinnerId);
                            // 필드 배틀 진행 시 배틀 모달 처리
                            if (battleMessage.card1Image !== null && battleMessage.card2Image !== null) {
                                setIsBattleInProgress(true); // 배틀 시작
                                setShowBattleModal(true); // 배틀 모달 열기
                                setBattleResultWinnerId(null); // 이전 배틀 결과 초기화

                                setBattleCard1ImageUrl(battleMessage.card1Image);
                                setBattleCard2ImageUrl(battleMessage.card2Image);
                            }

                            console.log('배틀 결과:', battleMessage.winnerId);
                            setBattleResultWinnerId(battleMessage.winnerId); // 배틀 결과 승자 ID 저장
                            // 배틀 종료는 isBattleInProgress가 false로 변경될 때 모달이 닫히도록 처리
                            setIsBattleInProgress(false); // 배틀 종료
                            // TODO: 배틀 결과 UI 처리
                        }
                        // SurrenderMessageDto 처리
                        else if(parsedMessage.message === "SURRENDER") {
                            const surrenderMessage: SurrenderMessageDto = parsedMessage;
                            setGameWinnerId(surrenderMessage.gameWinnerId);
                            setShowGameResultModal(true);
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

    useEffect(() => {
        const isMyTurn = gameInfo?.currentTurnPlayerId === userInfo?.id;

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (isMyTurn && !showGameResultModal) {
            setTimeLeft(90);

            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        if (gameInfo?.myCards && gameInfo.myCards.length > 0) {
                            const randomCard = gameInfo.myCards[Math.floor(Math.random() * gameInfo.myCards.length)];
                            handleSubmitCard(randomCard.gameCardId);
                        } else {
                            handleFieldBattleClick();
                        }
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            setTimeLeft(90); // Reset time when not my turn
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameInfo?.currentTurnPlayerId, userInfo?.id, showGameResultModal]);

    useEffect(() => {
        if (showGameResultModal) {
            if (blocker && blocker.state === 'blocked') {
                blocker.reset();//?????
            }
            disablePrevent();
        } else {
            enablePrevent();
        }
    }, [showGameResultModal, enablePrevent, disablePrevent]);

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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 4 }}>
            <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleSurrender}
                disabled={showGameResultModal} // 게임 종료 시 비활성화
            >
                항복
            </Button>
                <TurnTimer timeLeft={timeLeft} isMyTurn={gameInfo.currentTurnPlayerId === userInfo?.id && !showGameResultModal} />
            </Box>

            <Box mt={4}>
                <Typography variant="h6">내 카드:</Typography>
                {gameInfo.myCards.length === 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        size={'large'}
                        sx={{ mt: 2 }}
                        onClick={handleFieldBattleClick}
                        disabled={isBattleInProgress || gameInfo.currentTurnPlayerId !== userInfo?.id}
                    >
                        필드 배틀 시작
                    </Button>
                )}
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
                isMyTurn={gameInfo?.currentTurnPlayerId === userInfo?.id && !isBattleInProgress} // 내 턴이면서 배틀 중이 아닐 때만 제출 가능
                isFieldCard={selectedCardForDetail?.title === "Field Card"} // 필드 카드 여부 전달
            />

            <BattleModal
                open={showBattleModal}
                onClose={() => {
                    setShowBattleModal(false);
                    if (gameWinnerId !== null) {
                        setShowGameResultModal(true);
                    }
                }}
                card1ImageUrl={battleCard1ImageUrl}
                card2ImageUrl={battleCard2ImageUrl}
                winnerId={battleResultWinnerId}
                myPlayerId={userInfo?.id || 0}
            />

            {showGameResultModal && (
                <GameResultModal
                    winnerId={gameWinnerId}
                    myPlayerId={userInfo?.id || 0}
                    onExitGame={handleExitGame}
                />
            )}

            {showSurrenderConfirmModal && <ConfirmModal
                message="정말 항복하시겠습니까?"
                onConfirm={handleConfirmSurrender}
                onCancel={() => setShowSurrenderConfirmModal(false)}
            />}

            {blocker.state === 'blocked' && <ConfirmModal
                message="게임 중에 페이지를 떠나시겠습니까? 패배 처리될 수 있습니다."
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />}
        </Box>
    );
};

export default GameRoom;
