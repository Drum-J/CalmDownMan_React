import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../common/axios';

interface PasswordCheckModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function PasswordCheckModal({ open, onClose, onSuccess }: PasswordCheckModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        try {
            const response = await api.post('/user/checkPassword', { password });
            if (response.data.data === true) {
                onSuccess();
                setPassword('');
            } else {
                setError('비밀번호가 일치하지 않습니다.');
            }
        } catch (err) {
            setError('오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleClose = () => {
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="password-check-modal-title"
        >
            <Box sx={style}>
                <Typography id="password-check-modal-title" variant="h6" component="h2">
                    비밀번호 확인
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    회원 정보를 수정하려면 비밀번호를 입력해주세요.
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}

                />
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>취소</Button>
                    <Button variant="contained" onClick={handleSubmit}>확인</Button>
                </Box>
            </Box>
        </Modal>
    );
}