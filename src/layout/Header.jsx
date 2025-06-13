import './Header.css';
import {Box, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../api/axios.jsx";

export default function Header() {
    const [nickname, setNickname] = useState(null);

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
                        <Link to="/">도감</Link>
                        <Link to="/">게임</Link>
                        <Link to="/">교환</Link>
                        <Link to="/">마이페이지</Link>
                    </Stack>
                </Box>

                <Box className="nickname">
                    {nickname}님
                </Box>
            </Box>
        </Box>
    );
}