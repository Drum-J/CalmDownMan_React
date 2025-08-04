import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../common/axios';
import AlertModal from '../../modal/AlertModal';

export default function AddSeasonPage() {
    const [seasonName, setSeasonName] = useState('');
    const [seasonImage, setSeasonImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | '' | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSeasonImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!seasonName || !seasonImage) {
            setError('시즌 이름과 이미지를 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('seasonName', seasonName);
        formData.append('seasonImage', seasonImage);

        try {
            await api.post('/admin/card/season', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error("시즌 등록 실패:", err);
            setError('시즌 등록에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate('/admin/cards');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>새 시즌 추가</Typography>
            
            <Paper 
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: 'grey.100',
                    color: 'grey.500',
                    position: 'relative'
                }}
            >
                {!imagePreview && (
                    <Box sx={{textAlign: 'center'}}>
                        <PhotoCamera sx={{ fontSize: 40 }} />
                        <Typography>이미지를 선택하세요</Typography>
                    </Box>
                )}
            </Paper>
            <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
            />

            <TextField
                label="시즌 제목"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                fullWidth
                required
                margin="normal"
            />

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/admin/cards')} disabled={isSubmitting}>
                    취소
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : '저장'}
                </Button>
            </Box>

            {isSuccessModalOpen &&
                <AlertModal
                message="시즌이 성공적으로 등록되었습니다."
                onClick={handleSuccessModalClose}
                />
            }
        </Box>
    );
}
