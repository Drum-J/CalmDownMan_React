import './Header.css';
import {Box, IconButton, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/axios.jsx";
import CloseIcon from "@mui/icons-material/Close";

export default function Header() {
    const [nickname, setNickname] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
    };

    const onLogout = async () => {
        const response = await api.post('/token/logout');
        alert(response.data.data);
        localStorage.removeItem('token');
        navigate('/login');
    }

    const fetchData = async () => {
        try {
            const response = await api.get('/user/myInfo');
            setNickname(response.data.data.nickname);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log(error.response.status);
                alert(error.response.data.data);
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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
                        <Link to="/">게임</Link>
                        <Link to="/trade">교환</Link>
                        <Link to="/">마이페이지</Link>
                    </Stack>
                </Box>

                <Box className="nickname" onClick={handleClick} sx={{ cursor: 'pointer' }}>
                    {nickname}님
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
                        <CloseIcon/>
                        로그아웃
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}