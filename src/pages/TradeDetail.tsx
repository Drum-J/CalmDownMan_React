import {useState, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
    Paper,
    Typography,
    Box,
    Button
} from '@mui/material';
import api from '../common/axios';
import {ApiResponse} from "../common/ApiResponse";
import {TradeCardDetail, Trade, ListState} from '../components/trade/dto';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useUser} from "../common/UserContext";
import TradeDetailHeader from '../components/trade/modules/TradeDetailHeader';
import TradeCardGrid from '../components/trade/modules/TradeCardGrid';
import ConfirmModal from "../modal/ConfirmModal";
import AlertModal from "../modal/AlertModal";
import TradeRequestList from "../components/trade/modules/TradeRequestList";

export default function TradeDetail() {
    const { userInfo } = useUser();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const tradeData = location.state?.tradeData as Trade;
    const listState = location.state?.listState as ListState;
    const sourcePath = location.state?.sourcePath; // useTradeList에서 전달받은 경로
    const [tradeCards, setTradeCards] = useState<TradeCardDetail[]>([]);
    const [owner, setOwner] = useState<boolean>(false);
    const [cancel, setCancel] = useState<boolean>(false); // 교환 취소 컨펌 모달
    const [open, setOpen] = useState<boolean>(false); // alert 모달
    const [message, setMessage] = useState<string>('');

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

        if (userInfo !== null && tradeData) {
            setOwner(userInfo.id === tradeData.accountId);
        }
    }, [id, userInfo, tradeData]);

    if (!tradeData) {
        return <div>로딩 중...</div>;
    }

    const handleBack = () => {
        // sourcePath가 있으면 해당 경로로, 없으면 기본 경로인 '/trade'로 이동
        navigate(sourcePath || '/trade', {
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

    const handleCancelTrade = () => {
        setCancel(true);
    };

    const cancelConfirm = async () => {
        try {
            const response = await api.post(`/trade/post/cancel/${tradeData.tradeId}`);
            setCancel(false); // confirm 닫기
            setMessage(response.data.data); // alert 모달에 보여줄 메세지
            setOpen(true); // alert 모달 열기
        } catch (error) {
            setCancel(false); // confirm 닫기
            setMessage(error.response.data.data); // alert 모달에 보여줄 메세지
            setOpen(true); // alert 모달 열기
        }
    }

    const onCancel = () => {
        setCancel(false);
    }

    const alertConfirm = () => {
        setOpen(false);
        navigate('/trade', {state: {listState: listState}});
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <TradeDetailHeader
                    title={tradeData.title}
                    tradeStatus={tradeData.tradeStatus}
                    isOwner={owner}
                    onCancel={handleCancelTrade}
                />

                <Typography align={'right'} variant="subtitle1" color="text.secondary" sx={{ mb: 2}}>
                    작성자: {tradeData.nickname}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3 }}>
                    {tradeData.content}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2 }}>⭐교환 등록 카드⭐</Typography>
                <TradeCardGrid cards={tradeCards} />

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
                {id && <TradeRequestList tradeId={id} isOwner={owner} isWaiting={tradeData.tradeStatus === 'WAITING'} />}
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

            {cancel && <ConfirmModal
                message={'교환글을 취소할까요?'}
                onCancel={onCancel}
                onConfirm={cancelConfirm}
            />}

            {open && <AlertModal
                message={message}
                onClick={alertConfirm}
            />}
        </Box>
    );
}