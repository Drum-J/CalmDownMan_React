import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    CircularProgress
} from '@mui/material';
import api from '../../common/axios';
import { ApiResponse } from "../../common/ApiResponse";
import { UserInfo } from "../../common/UserContext";
import AlertModal from "../../modal/AlertModal";

// 이전 페이지에서 받아온 카드 정보 타입
interface SelectedCard {
    id: number;
    title: string;
    imageUrl: string;
    quantity: number;
}

interface LocationState {
    user: UserInfo;
    selectedCards: SelectedCard[];
}

export default function CardSupplyConfirmPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const { user, selectedCards } = state || {};

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (!user || !selectedCards || selectedCards.length === 0) {
            alert("잘못된 접근입니다. 카드 지급 페이지로 돌아갑니다.");
            navigate('/admin/cardSupply', { state: { user } });
        }
    }, [user, selectedCards, navigate]);

    const handleConfirmSupply = async () => {
        setIsSubmitting(true);
        try {
            const supplyData = {
                accountId: user.id,
                cards: selectedCards.map(card => ({ cardId: card.id, count: card.quantity }))
            };

            // 카드 지급 API 호출 (엔드포인트는 백엔드에 맞게 수정 필요)
            await api.post<ApiResponse<any>>('/admin/card/supply', supplyData);

            setAlertMessage("성공적으로 카드를 지급했습니다. 사용자 관리 페이지로 이동합니다.");
            setAlertOpen(true);

        } catch (error) {
            console.error('카드 지급에 실패했습니다:', error);
            setAlertMessage("카드 지급 과정에서 오류가 발생했습니다.");
            setAlertOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
        if (alertMessage.includes("성공적으로")) {
            navigate('/admin/users');
        }
    };

    if (!user || !selectedCards) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                    카드 지급 최종 확인
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    - 받는 사용자: {user.nickname} ({user.username})
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>- 지급할 카드 목록</Typography>

                <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 3 }}>
                    {selectedCards.map((card, index) => (
                        <Box key={card.id}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar variant="rounded" src={card.imageUrl} sx={{ width: 56, height: 56, mr: 2 }} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={card.title} 
                                    secondary={`수량: ${card.quantity}장`} 
                                />
                            </ListItem>
                            {index < selectedCards.length - 1 && <Divider variant="inset" component="li" />}
                        </Box>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                    >
                        이전으로
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleConfirmSupply}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : '최종 승인 및 지급'}
                    </Button>
                </Box>
            </Paper>
            
            {alertOpen && (
                <AlertModal
                    message={alertMessage}
                    onClick={handleAlertClose}
                />
            )}
        </Box>
    );
}
