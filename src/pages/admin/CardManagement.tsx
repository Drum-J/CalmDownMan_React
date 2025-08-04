import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent, IconButton, CircularProgress, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../common/axios';
import AlertModal from "../../modal/AlertModal";

// API 응답에 맞춘 시즌 데이터 타입
interface Season {
    id: number;
    title: string;
    imageUrl: string;
}

export default function CardManagement() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSeasons = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<{ data: Season[] }>('/card/seasons');
                setSeasons(response.data.data);
            } catch (error) {
                console.error("시즌 목록을 불러오는 데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeasons();
    }, []);

    const handleAddSeasonClick = () => {
        navigate('/admin/cards/addSeason');
    };

    const handleSeasonClick = (seasonId: number) => {
        console.log(`시즌 ${seasonId} 상세 보기`);
        // navigate(`/admin/cards/seasons/${seasonId}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>카드 시즌 관리</Typography>
            <Box sx={{ display: 'flex', overflowX: 'auto', alignItems: 'flex-start', py: 2, gap: 3 }}>
                {seasons.map((season) => (
                    <Card key={season.id} sx={{ flexShrink: 0, width: 300 }}>
                        <CardActionArea onClick={() => handleSeasonClick(season.id)}>
                            <CardMedia
                                component="img"
                                height="400"
                                image={season.imageUrl}
                                alt={season.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div" noWrap>
                                    {season.title}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}

                {/* 새 시즌 추가 버튼 */}
                <Paper
                    variant="outlined"
                    sx={{
                        flexShrink: 0,
                        width: 220,
                        height: 400, // Card 컴포넌트 높이와 유사하게 설정
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        borderColor: 'grey.500',
                        cursor: 'pointer',
                        "&:hover": {
                            backgroundColor: 'grey.100'
                        }
                    }}
                    onClick={handleAddSeasonClick}
                >
                    <IconButton color="primary" sx={{ width: 80, height: 80 }}>
                        <AddIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                </Paper>
            </Box>
        </Box>
    );
}