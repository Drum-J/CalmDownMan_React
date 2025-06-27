import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../common/axios';
import { TradeCardDetail } from '../components/trade/dto';
import AlertModal from "../modal/AlertModal";

export default function TradePostCreate() {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 페이지에서 전달받은 상태(제목, 내용, 선택된 카드)로 초기화합니다.
    const [title, setTitle] = useState(location.state?.title || '');
    const [content, setContent] = useState(location.state?.content || '');
    const [selectedCards, setSelectedCards] = useState<TradeCardDetail[]>(location.state?.selectedCards || []);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    // 카드 선택 페이지에서 돌아왔을 때, 선택된 카드 목록을 업데이트합니다.
    useEffect(() => {
        if (location.state?.selectedCards) {
            setSelectedCards(location.state.selectedCards);
        }
    }, [location.state]);

    // '카드 고르기' 버튼 클릭 시, 현재 입력된 제목과 내용을 저장한 채로 페이지를 이동합니다.
    const handleSelectCardClick = () => {
        navigate('/selectCards', {
            state: {
                purpose: 'tradePost',
                title,
                content
            }
        });
    };

    // 선택된 카드 목록에서 특정 카드를 제거합니다.
    const handleRemoveCard = (indexToRemove: number) => {
        // indexToRemove와 다른 인덱스를 가진 카드만 남겨 새 배열을 만듭니다.
        setSelectedCards(prevSelectedCards =>
            prevSelectedCards.filter((_, index) => index !== indexToRemove)
        );
    };

    // '등록' 버튼 클릭 시, 서버로 데이터를 전송합니다.
    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || selectedCards.length === 0) {
            alert('제목, 내용, 그리고 교환할 카드를 모두 선택해주세요.');
            return;
        }

        const cardIds = selectedCards.map(card => card.cardId);

        try {
            const response = await api.post('/trade/post', {
                title,
                content,
                cardIds
            });
            setMessage(response.data.data);
            setOpen(true);
        } catch (error) {
            console.error('교환글 등록 실패:', error);
            alert('교환글 등록에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // '취소' 버튼 클릭 시, 이전 페이지로 돌아갑니다.
    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                교환글 등록
            </Typography>
            <TextField
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                sx={{ width: '80%' }}
            />
            <TextField
                label="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={6}
                sx={{ width: '80%' }}
            />
            <Box sx={{ my: 2 }}>
                <Button variant="contained" onClick={handleSelectCardClick}>
                    카드 고르기
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>
                선택된 카드 ({selectedCards.length}개)
            </Typography>
            <Grid container justifyContent={'center'} spacing={2}>
                {selectedCards.length > 0 ? (
                    selectedCards.map((card, index) => (
                        <Grid key={index}>
                            <Card sx={{ position: 'relative' }}>
                                <IconButton
                                    aria-label="remove card"
                                    onClick={() => handleRemoveCard(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)'}
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <CardMedia
                                    component="img"
                                    image={card.imageUrl}
                                    alt={card.title}
                                    height="350"
                                    referrerPolicy="no-referrer"
                                    sx={{width: 245, objectFit: 'cover'}}
                                />
                                <CardContent sx={{ backgroundColor:'#282831' }}>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        등급: {card.grade}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid>
                        <Typography color="text.secondary">교환할 카드를 선택해주세요.</Typography>
                    </Grid>
                )}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    취소
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    등록
                </Button>
            </Box>

            {open && <AlertModal message={message} onClick={()=> navigate('/trade')}/>}
        </Box>
    );
}