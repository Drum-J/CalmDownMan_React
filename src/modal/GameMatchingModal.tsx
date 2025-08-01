import { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Modal, Stack } from '@mui/material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../common/axios';
import { useUser } from '../common/UserContext';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

interface GameMatchingModalProps {
    open: boolean;
    onClose: () => void;
    selectedCards: any[]; // MyCardDetailDto[] 타입이 될 것임, SelectCardPage.tsx 에 있음。
}

const GameMatchingModal = ({ open, onClose, selectedCards }: GameMatchingModalProps) => {
    const { userInfo } = useUser();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'registering' | 'waiting' | 'cancelling' | 'error' | 'success'>('idle');
    const [message, setMessage] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const stompClientRef = useRef<Client | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const initiateMatching = async () => {
            if (!open) return; // 모달이 닫혀있으면 아무것도 하지 않음

            setStatus('registering');
            setMessage('매칭 대기열에 등록 중입니다...');
            setElapsedTime(0);
            const cardIds = selectedCards.map(card => card.id);

            // 1. WebSocket 연결 및 구독 시작
            const socket = new SockJS('http://localhost:8080/ws-connection');
            const client = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    connectHeaders: {
                        'playerId': userInfo.id.toString()
                    },
                    onConnect: async () => { // onConnect를 async 함수로 변경
                        console.log('Connected to WebSocket for matching result');
                        stompClientRef.current = client;

                        client.subscribe(`/queue/game/matching/success/${userInfo.id}`, (msg) => {
                            const gameRoomId = JSON.parse(msg.body);
                            console.log(`매칭 성공! Game Room ID: ${gameRoomId}`);
                            setStatus('success');
                            setMessage('매칭 성공! 게임을 시작합니다.');
                            navigate(`/gameRoom/${gameRoomId}`);
                            onClose(); // 매칭 성공 시 모달 닫기
                        });

                        // 2. WebSocket 연결 성공 후 매칭 대기열 등록 API 호출
                        try {
                            const response = await api.post('/game/matching/join', {
                                playerId: userInfo.id,
                                cardIds: cardIds,
                            });

                            if (response.data.status === 200) {
                                setStatus('waiting');
                                setMessage('상대를 찾고 있습니다...');
                            } else {
                                console.log(status, response.data.message);
                                setStatus('error'); // API 호출 실패 시 에러 상태로 변경
                                setMessage('매칭 대기열 등록에 실패했습니다. 다시 시도해주세요.');
                                if (stompClientRef.current) stompClientRef.current.deactivate(); // 실패 시 웹소켓 연결 해제
                            }
                        } catch (error) {
                            console.error('매칭 대기열 등록 중 오류 발생:', error);
                            setStatus('error'); // API 호출 중 예외 발생 시 에러 상태로 변경
                            setMessage('매칭 대기열 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
                            if (stompClientRef.current) stompClientRef.current.deactivate(); // 실패 시 웹소켓 연결 해제
                        }
                    },
                        onStompError: (frame) => {
                            console.error('Broker reported error: ' + frame.headers['message']);
                            console.error('Additional details: ' + frame.body);
                            setStatus('error');
                            setMessage('매칭 중 오류가 발생했습니다. 다시 시도해주세요.');
                            if (stompClientRef.current) stompClientRef.current.deactivate();
                        },
                        onDisconnect: () => {
                            console.log('Disconnected from WebSocket');
                            if (status === 'waiting') { // 매칭 대기 중 연결 끊김
                                setStatus('error');
                                setMessage('매칭 연결이 끊겼습니다. 다시 시도해주세요.');
                            }
                        }
                    });
                    client.activate();
            };

        if (open) {
            initiateMatching();
        } else {
            // 모달이 닫힐 때 WebSocket 연결 정리
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setStatus('idle');
            setMessage('');
            setElapsedTime(0);
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [open, userInfo.id, selectedCards, onClose, navigate]); // status를 의존성 배열에서 제거

    // 타이머 useEffect
    useEffect(() => {
        if (status === 'waiting') {
            timerRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [status]);

    const handleCancelMatching = async () => {
        setStatus('cancelling');
        setMessage('매칭 취소 중...');
        try {
            await api.delete(`/game/matching/cancel`); // userId를 경로에 포함
            setMessage('매칭이 취소되었습니다.');
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('매칭 취소 중 오류 발생:', error);
            setMessage('매칭 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            open={open}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box className="modal-content" sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>{message}</Typography>
                {(status === 'registering' || status === 'cancelling') && (
                    <CircularProgress sx={{ mt: 2 }} />
                )}
                {status === 'waiting' && (
                    <Box sx={{ mt: 2 }}>
                        <CircularProgress size={60} thickness={5} />
                        <Typography variant="h6" sx={{ mt: 2 }}>{formatTime(elapsedTime)}</Typography>
                    </Box>
                )}
                {status === 'waiting' && (
                    <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            onClick={handleCancelMatching}
                            variant="contained"
                            color="secondary"
                        >
                            취소
                        </Button>
                    </Stack>
                )}
                {status === 'error' && (
                    <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="primary"
                        >
                            닫기
                        </Button>
                    </Stack>
                )}
                {status === 'cancelling' && (
                    <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            onClick={handleCancelMatching}
                            variant="contained"
                            color="primary"
                        >
                            매칭 취소
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="secondary"
                        >
                            닫기
                        </Button>
                    </Stack>
                )}
            </Box>
        </Modal>
    );
};

export default GameMatchingModal;
