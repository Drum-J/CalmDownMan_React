import { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Box,
    TextField,
    TablePagination
} from '@mui/material';
import api from '../../common/axios';
import { UserInfo } from '../../common/UserContext';
import {format} from "date-fns";
import UserEditModal from '../../modal/UserEditModal';

export default function UserManagement() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/admin/user');
            setUsers(response.data.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Sync selectedUser with the main users list after data is refreshed
    useEffect(() => {
        if (selectedUser) {
            const updatedUser = users.find(u => u.id === selectedUser.id);
            if (updatedUser) {
                setSelectedUser(updatedUser);
            }
        }
    }, [users, selectedUser?.id]);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleRowClick = (user: UserInfo) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Delay clearing selected user to prevent modal content from disappearing during closing animation
        setTimeout(() => setSelectedUser(null), 300);
    };

    const handleSave = () => {
        fetchUsers(); // Refresh data, the useEffect above will sync the selectedUser
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>사용자 관리</Typography>
            <Box sx={{ marginBottom: 2 }}>
                <TextField
                    variant="outlined"
                    label="유저명 또는 닉네임 검색"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>프로필</TableCell>
                            <TableCell>유저명</TableCell>
                            <TableCell>닉네임</TableCell>
                            <TableCell>포인트</TableCell>
                            <TableCell>랭크 점수</TableCell>
                            <TableCell>승</TableCell>
                            <TableCell>패</TableCell>
                            <TableCell>무</TableCell>
                            <TableCell>역할</TableCell>
                            <TableCell>가입일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                            <TableRow
                                key={user.id}
                                onClick={() => handleRowClick(user)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Avatar src={user.profileImage} alt={user.nickname} />
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>{user.point}</TableCell>
                                <TableCell>{user.rankScore}</TableCell>
                                <TableCell>{user.winCount}</TableCell>
                                <TableCell>{user.loseCount}</TableCell>
                                <TableCell>{user.drawCount}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    {format(new Date(user.createdAt), 'MM월 dd일 HH시 mm분')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            <UserEditModal
                user={selectedUser}
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </Box>
    );
}
