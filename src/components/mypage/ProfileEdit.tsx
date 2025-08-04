import {useState, useRef, ChangeEvent, useEffect} from 'react';
import { Avatar, Box, Button, TextField, Typography, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../common/axios';
import { useUser } from '../../common/UserContext';

interface ProfileEditProps {
    onCancel: () => void;
}

export default function ProfileEdit({ onCancel }: ProfileEditProps) {
    const { userInfo, setUserInfo } = useUser();
    const [nickname, setNickname] = useState(userInfo?.nickname || '');
    const [profileImage, setProfileImage] = useState(userInfo?.profileImage || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('');
            return true;
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해주세요.');
            return false;
        }
        if (password !== passwordCheck) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        setPasswordError('');
        return true;
    };

    useEffect(() => {
        validatePassword()
    }, [password, passwordCheck]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setImageFile(file);
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validatePassword()) {
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('nickname', nickname);
        if (password) {
            formData.append('password', password);
        }
        if (imageFile) {
            formData.append('profileImage', imageFile);
        }

        try {
            const response = await api.put('/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.data) {
                const updatedUserInfo = response.data.data;
                // S3에 동일한 URL로 이미지가 덮어씌워지므로, 브라우저 캐시를 무효화하기 위해 쿼리 파라미터를 추가합니다.
                if (updatedUserInfo.profileImage) {
                    updatedUserInfo.profileImage = `${updatedUserInfo.profileImage}?t=${new Date().getTime()}`;
                }
                setUserInfo(updatedUserInfo);
            }
            onCancel();
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            alert(error.response.data.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 비밀번호 보이기/숨기기 Adornment
    const passwordVisibilityAdornment = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="secondary"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        ),
    };


    if (!userInfo) return null;

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                정보 수정
            </Typography>

            <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <Avatar
                src={profileImage || undefined}
                sx={{ width: 120, height: 120, mb: 2, cursor: 'pointer' }}
                onClick={handleAvatarClick}
            >
                {!profileImage && nickname.charAt(0)}
            </Avatar>

            <TextField
                margin="normal"
                fullWidth
                id="username"
                label="아이디"
                name="username"
                value={userInfo.username}
                disabled
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="nickname"
                label="닉네임"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                autoFocus
            />
            <TextField
                margin="normal"
                fullWidth
                id="password"
                label="새 비밀번호"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                error={!!passwordError}
                helperText={passwordError || "비밀번호를 변경하지 않을 경우 비워두세요."}
                slotProps={{input: passwordVisibilityAdornment}}
            />
            {password&& <TextField
                margin="normal"
                fullWidth
                id="passwordCheck"
                label="새 비밀번호 확인"
                name="passwordCheck"
                type={showPassword ? 'text' : 'password'}
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                onBlur={validatePassword}
                error={!!passwordError}
            />}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !!passwordError}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : '저장'}
                </Button>
            </Box>
        </Box>
    );
}