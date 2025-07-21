import './Header.css';
import {Box, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useState, MouseEvent} from "react";
import api from "../common/axios";
import CloseIcon from "@mui/icons-material/Close";
import {useUser} from "../common/UserContext";

export default function Header() {
    const { userInfo } = useUser();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleLogout = (): void => {
        handleClose();
        onLogout();
    };

    const onLogout = async (): Promise<void> => {
        try {
            const response = await api.post('/token/logout');
            alert(response.data.data);
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    }

    return (
        <Box className="header">
            <Typography className="title" variant="h4" align="center">
                침착맨 온라인 카드게임
            </Typography>

            <Box className="nav-row">
                <Box className="navbar">
                    <Stack direction="row" spacing={4}>
                        <Link to="/">카드 뽑기</Link>
                        <Link to="/cardDex">도감</Link>
                        <Link to="/selectCards" state={{purpose: 'gameReady'}}>게임</Link>
                        <Link to="/trade">교환</Link>
                        <Link to="/mypage">마이페이지</Link>
                    </Stack>
                </Box>

                <Box className="nickname" onClick={handleClick} sx={{ cursor: 'pointer' }}>
                    {userInfo?.nickname}님
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleLogout}>
                        <CloseIcon />
                        로그아웃
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}