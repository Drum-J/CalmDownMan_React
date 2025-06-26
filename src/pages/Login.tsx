import {FormEvent, JSX, useState} from "react";
import api from "../common/axios";
import {Link, useNavigate} from "react-router-dom";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import {ApiError, ApiResponse} from "../common/ApiResponse";

export default function Login(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await api.post<ApiResponse<string>>("/login", {
                username,
                password,
            });

            // 응답에서 JWT 토큰 추출
            const token = response.data.data;

            // 토큰을 localStorage에 저장
            localStorage.setItem("token", token);
            
            // 로그인 후 원하는 경로로 리디렉션
            navigate("/");
        } catch (err) {
            const error = err as ApiError;
            // 백엔드 응답이 있으면
            if (error.response) {
                const status = error.response.status;
                const apiResponse = error.response.data;

                if (status === 404 || status === 401) {
                    setError(apiResponse.data); // "아이디나 비밀번호가 틀렸습니다."
                } else {
                    setError(`알 수 없는 오류가 발생했습니다. (${status})`);
                }
            } else {
                setError("서버에 연결할 수 없습니다.");
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                justifyContent: 'center',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: 450, borderRadius: 2}}>
                <Typography variant="h4" align="center" gutterBottom mb={4}>
                    Chim Card Online
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="아이디"
                        variant="outlined"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        autoFocus
                    />

                    <TextField
                        label="비밀번호"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        로그인
                    </Button>

                    {error && <Box style={{ color: "red" }}>{error}</Box>}

                    <Box>
                        계정이 없으신가요? <Link to="/signup">회원가입</Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}