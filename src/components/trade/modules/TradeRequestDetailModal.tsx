import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import { TradeRequestListDto, TradeCardDetail } from '../dto';
import api from '../../../common/axios';
import { ApiResponse } from '../../../common/ApiResponse';
import TradeCardGrid from './TradeCardGrid';
import AlertModal from "../../../modal/AlertModal";
import {useUser} from "../../../common/UserContext";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    backgroundColor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface TradeRequestDetailModalProps {
    open: boolean;
    onClose: () => void;
    requestData: TradeRequestListDto | null;
    tradeId: string;
    onSuccess: () => void;
    isOwner: boolean;
    isWaiting: boolean;
}

export default function TradeRequestDetailModal({ open, onClose, requestData, tradeId, onSuccess, isOwner, isWaiting }: TradeRequestDetailModalProps) {
    const [cards, setCards] = useState<TradeCardDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const {userInfo} = useUser();
    const [isRequester, setIsRequester] = useState(false);

    useEffect(() => {
        if (requestData) {
            const fetchRequestCards = async () => {
                setLoading(true);
                setIsRequester(false);
                try {
                    // 참고: 이 API는 백엔드에 구현이 필요합니다.
                    const response
                        = await api.get<ApiResponse<TradeCardDetail[]>>(`/trade/request/detail/${requestData.id}`);
                    setCards(response.data.data);

                    // 교환 신청 글을 보는 사람이 신청자 본인인 경우
                    if (userInfo?.id === requestData.requesterId) {
                        setIsRequester(true);
                    }
                } catch (error) {
                    console.error('교환 신청 카드 정보를 불러오는데 실패했습니다:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRequestCards();
        }
    }, [requestData]);

    const handleReject = async () => {
        if (!requestData) return;
        try {
            const response = await api.post<ApiResponse<string>>(`/trade/reject/${tradeId}`, { requestId: requestData.id });
            setAlertMessage(response.data.data);
            setAlertOpen(true);
        } catch (error) {
            setAlertMessage('교환 거절에 실패했습니다: ' + error.response.data.data);
            setAlertOpen(true);
        }
    };

    const handleAccept = async () => {
        if (!requestData) return;
        try {
            const response = await api.post<ApiResponse<string>>(`/trade/complete/${tradeId}`, { requestId: requestData.id });
            setAlertMessage(response.data.data);
            setAlertOpen(true);
        } catch (error) {
            setAlertMessage('교환 수락에 실패했습니다: ' + error.response.data.data);
            setAlertOpen(true);
        }
    };

    const handleCancel = async () => {
        if (!requestData) return;
        try {
            const response = await api.post<ApiResponse<string>>(`/trade/request/cancel/${requestData.id}`);
            setAlertMessage(response.data.data);
            setAlertOpen(true);
        } catch (error) {
            setAlertMessage('신청 취소 실패했습니다: ' + error.response.data.data);
            setAlertOpen(true);
        }
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
        onSuccess();
        onClose();
    }

    if (!requestData) {
        return null;
    }

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="trade-request-detail-modal-title"
            >
                <Box sx={style}>
                    <Typography id="trade-request-detail-modal-title" variant="h6" component="h2">
                        {requestData.nickname}님의 교환 신청 카드
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ my: 2, maxHeight: 500, overflowY: 'auto' }}>
                            <TradeCardGrid cards={cards} />
                        </Box>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" color="secondary" onClick={onClose}>닫기</Button>
                        {(isOwner && isWaiting && requestData.tradeStatus === "WAITING")
                            && <Button variant="contained" color="error" onClick={handleReject}>거절</Button>
                        }
                        {(isOwner && isWaiting && requestData.tradeStatus === "WAITING")
                            && <Button variant="contained" color="primary" onClick={handleAccept}>교환</Button>
                        }
                        {(isRequester && isWaiting && requestData.tradeStatus === "WAITING")
                            && <Button variant="contained" color="secondary" onClick={handleCancel}>신청 취소</Button>
                        }
                    </Box>
                </Box>
            </Modal>

            {alertOpen && <AlertModal message={alertMessage} onClick={handleAlertClose} />}
        </>
);
}