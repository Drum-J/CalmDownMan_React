import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { UserInfo } from '../common/UserContext';
import api from '../common/axios';
import './Modal.css';
import ConfirmModal from './ConfirmModal';
import AlertModal from './AlertModal';

interface UserEditModalProps {
    user: UserInfo | null;
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

export default function UserEditModal({ user, open, onClose, onSave }: UserEditModalProps) {
    const [role, setRole] = useState(user?.role || 'USER');
    const [pointsToAdd, setPointsToAdd] = useState(0);

    // Modal States
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (user) {
            setRole(user.role);
            setPointsToAdd(0);
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handleRoleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPointsToAdd(Number(event.target.value));
    };

    const performGrantPoints = async () => {
        if (pointsToAdd <= 0) {
            setAlertMessage("0보다 큰 값을 입력해주세요.");
            setAlertOpen(true);
            return;
        }
        try {
            await api.put(`/admin/user/${user.id}/point`, { point: pointsToAdd });
            setAlertMessage(`${pointsToAdd} 포인트가 성공적으로 지급되었습니다.`);
            setAlertOpen(true);
            onSave();
        } catch (error) {
            console.error("Failed to grant points:", error);
            setAlertMessage("포인트 지급에 실패했습니다.");
            setAlertOpen(true);
        }
    };

    const performSaveRole = async () => {
        try {
            await api.put(`/admin/user/${user.id}/role`, { role: role });
            setAlertMessage(`역할이 성공적으로 ${role}(으)로 변경되었습니다.`);
            setAlertOpen(true);
            onSave();
        } catch (error) {
            console.error("Failed to update role:", error);
            setAlertMessage("역할 변경에 실패했습니다.");
            setAlertOpen(true);
        }
    };

    const handleGrantPointsClick = () => {
        setConfirmMessage(`${user.nickname}님에게 ${pointsToAdd} 포인트를 지급하시겠습니까?`);
        setOnConfirmAction(() => performGrantPoints);
        setConfirmOpen(true);
    };

    const handleSaveRoleClick = () => {
        setConfirmMessage(`${user.nickname}님의 역할을 ${role}(으)로 변경하시겠습니까?`);
        setOnConfirmAction(() => performSaveRole);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
        setConfirmOpen(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Avatar src={user.profileImage} sx={{ width: 128, height: 128, mb: 2 }} />
                <Typography variant="h6">{user.nickname}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {user.username}
                </Typography>

                <Box sx={{ width: '100%' }}>
                    <Typography sx={{ mt: 2 }}>현재 포인트: {user.point}</Typography>
                    <Typography sx={{ mt: 1, mb: 2 }}>현재 역할: {user.role}</Typography>

                    <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel>역할 변경</InputLabel>
                        <Select value={role} label="역할 변경" onChange={handleRoleChange}>
                            <MenuItem value={'USER'}>USER</MenuItem>
                            <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleSaveRoleClick} fullWidth sx={{ mb: 2 }}>역할 저장</Button>

                    <TextField
                        label="지급할 포인트"
                        type="number"
                        fullWidth
                        value={pointsToAdd || ''}
                        onChange={handlePointsChange}
                        sx={{ mb: 1 }}
                    />
                    <Button variant="contained" color="success" onClick={handleGrantPointsClick} fullWidth>포인트 지급</Button>
                </Box>

                <Button onClick={onClose} sx={{ mt: 3 }}>닫기</Button>

                {confirmOpen && (
                    <ConfirmModal
                        message={confirmMessage}
                        onConfirm={handleConfirm}
                        onCancel={() => setConfirmOpen(false)}
                    />
                )}

                {alertOpen && (
                    <AlertModal
                        message={alertMessage}
                        onClick={() => setAlertOpen(false)}
                    />
                )}
            </Box>
        </Modal>
    );
}
