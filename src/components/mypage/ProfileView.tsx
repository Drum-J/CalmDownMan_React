import { Avatar, Box, Button, Typography } from '@mui/material';
import { UserInfo } from '../../common/UserContext';

interface ProfileViewProps {
    userInfo: UserInfo;
    onEditClick: () => void;
}

export default function ProfileView({ userInfo, onEditClick }: ProfileViewProps) {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Avatar
                src={userInfo.profileImage || undefined}
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
            >
                {/* 이미지가 없을 경우 닉네임 첫 글자 표시 */}
                {!userInfo.profileImage && userInfo.nickname.charAt(0)}
            </Avatar>
            <Typography component="h1" variant="h4">
                {userInfo.nickname}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                @{userInfo.username}
            </Typography>
            <Button
                variant="contained"
                onClick={onEditClick}
            >
                수정하기
            </Button>
        </Box>
    );
}