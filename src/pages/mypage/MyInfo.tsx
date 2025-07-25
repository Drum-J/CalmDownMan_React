import {useEffect, useState} from 'react';
import ProfileView from '../../components/mypage/ProfileView';
import ProfileEdit from '../../components/mypage/ProfileEdit';
import PasswordCheckModal from '../../modal/PasswordCheckModal';
import { useUser } from '../../common/UserContext';
import { Box, Container } from "@mui/material";

export default function MyInfo() {
    const { userInfo, refreshUserInfo } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        refreshUserInfo();
    }, []);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handlePasswordSuccess = () => {
        setIsModalOpen(false);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (!userInfo) {
        return <div>Loading...</div>; // 또는 다른 로딩 상태 표시
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {isEditing ? (
                    <ProfileEdit onCancel={handleCancelEdit} />
                ) : (
                    <ProfileView userInfo={userInfo} onEditClick={handleEditClick} />
                )}
                <PasswordCheckModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handlePasswordSuccess}
                />
            </Box>
        </Container>
    );
}