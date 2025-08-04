import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../common/axios';
import AlertModal from '../../modal/AlertModal';

const attackTypeOptions = [
    { value: 'ROCK', label: '바위' },
    { value: 'SCISSORS', label: '가위' },
    { value: 'PAPER', label: '보' },
    { value: 'ALL', label: 'ALL' },
];

const gradeOptions = [
    { value: 'SSR', label: 'SSR' },
    { value: 'SR', label: 'SR' },
    { value: 'R', label: 'R' },
    { value: 'N', label: 'N' },
    { value: 'C', label: 'C' },
    { value: 'V', label: 'V' },
];

export default function AddCardPage() {
    const { seasonId } = useParams<{ seasonId: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [power, setPower] = useState(0);
    const [attackType, setAttackType] = useState('');
    const [grade, setGrade] = useState('');
    const [cardImage, setCardImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCardImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title || !attackType || !grade || !cardImage || !seasonId) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('power', String(power));
        formData.append('attackType', attackType);
        formData.append('grade', grade);
        formData.append('cardSeasonId', seasonId);
        formData.append('cardImage', cardImage);

        try {
            await api.post('/admin/card', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error("카드 등록 실패:", err);
            setError('카드 등록에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate(`/admin/cards/seasons/${seasonId}`);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>새 카드 추가</Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        width: 240,
                        height: 350,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', backgroundImage: `url(${imagePreview})`,
                        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    }}
                >
                    {!imagePreview && (
                        <Box sx={{textAlign: 'center'}}>
                            <PhotoCamera sx={{ fontSize: 40 }} />
                            <Typography>카드 이미지 선택</Typography>
                        </Box>
                    )}
                </Paper>
                <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
            </Box>

            <TextField label="카드 이름" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required margin="normal" />
            <TextField label="침투력" type="number" value={power} onChange={(e) => setPower(Number(e.target.value))} fullWidth required margin="normal" />
            <FormControl fullWidth required margin="normal">
                <InputLabel>공격 타입</InputLabel>
                <Select value={attackType} label="공격 타입" onChange={(e) => setAttackType(e.target.value)}>
                    {attackTypeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth required margin="normal">
                <InputLabel>등급</InputLabel>
                <Select value={grade} label="등급" onChange={(e) => setGrade(e.target.value)}>
                    {gradeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </FormControl>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(`/admin/cards/seasons/${seasonId}`)} disabled={isSubmitting}>취소</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : '저장'}
                </Button>
            </Box>

            {isSuccessModalOpen && (
                <AlertModal
                    message="카드가 성공적으로 등록되었습니다."
                    onClick={handleSuccessModalClose}
                />
            )}
        </Box>
    );
}
