import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../../common/axios';
import AlertModal from '../../modal/AlertModal';
import { Card } from '../../components/card/dto';

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

export default function EditCardPage() {
    const { state } = useLocation();
    const { seasonId, cardId } = state || {}; // state가 null일 경우를 대비
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [power, setPower] = useState(0);
    const [attackType, setAttackType] = useState('');
    const [grade, setGrade] = useState('');
    const [cardImage, setCardImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isInvalidAccess, setIsInvalidAccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!seasonId || !cardId) {
            setIsInvalidAccess(true);
            return;
        }

        const fetchCardData = async () => {
            try {
                const response = await api.get<{ data: Card }>(`/card/${cardId}`);
                const card = response.data.data;
                setTitle(card.title);
                setPower(card.power);
                // 백엔드에서 넘어오는 attackType(표시 값)을 enum 값으로 매핑
                const mappedAttackType = attackTypeOptions.find(opt => opt.label === card.attackType)?.value || '';
                setAttackType(mappedAttackType);
                setGrade(card.grade);
                setImagePreview(card.imageUrl);
            } catch (err) {
                console.error("카드 정보를 불러오는 데 실패했습니다:", err);
                setError("카드 정보를 불러올 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCardData();
    }, [cardId, seasonId]);

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
        if (!title || !attackType || !grade || !seasonId) {
            setError('필수 필드를 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("id", cardId);
        formData.append('title', title);
        formData.append('power', String(power));
        formData.append('attackType', attackType);
        formData.append('grade', grade);
        formData.append('cardSeasonId', seasonId);
        if (cardImage) { // 이미지가 변경된 경우에만 추가
            formData.append('cardImage', cardImage);
        }

        try {
            await api.put(`/admin/card`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error("카드 수정 실패:", err);
            setError('카드 수정에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate(`/admin/cards/seasons/${seasonId}`);
    };

    if (isInvalidAccess) {
        return (
            <AlertModal
                message="잘못된 접근입니다. 카드 시즌 목록으로 돌아갑니다."
                onClick={() => navigate('/admin/cards')}
            />
        );
    }

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>카드 정보 수정</Typography>

            <Paper 
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                    height: 350,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backgroundImage: `url(${imagePreview})`,
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    mb: 2
                }}
            >
                {!imagePreview && (
                    <Box sx={{textAlign: 'center'}}>
                        <PhotoCamera sx={{ fontSize: 40 }} />
                        <Typography>새 이미지 선택</Typography>
                    </Box>
                )}
            </Paper>
            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />

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
                    {isSubmitting ? <CircularProgress size={24} /> : '수정 완료'}
                </Button>
            </Box>

            {isSuccessModalOpen && (
                <AlertModal
                    message="카드가 성공적으로 수정되었습니다."
                    onClick={handleSuccessModalClose}
                />
            )}
        </Box>
    );
}
