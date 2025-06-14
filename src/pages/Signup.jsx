import {useState, useEffect} from "react";
import api from "../api/axios";
import {useNavigate} from "react-router-dom";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";

function Signup() {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const isFormValid =
        username &&
        nickname &&
        password &&
        passwordCheck &&
        usernameChecked &&
        password === passwordCheck;

    useEffect(() => {
        // username 입력이 바뀌면 중복 체크 무효화
        setUsernameChecked(false);
        setUsernameMessage("");
    }, [username]);

    const handleCheckUsername = async () => {
        try {
            const response = await api.get("/signup/checkUsername", {
                params: {username},
            });
            setUsernameMessage(response.data.data);
            setUsernameChecked(true);
        } catch (err) {
            if (err.response) {
                setUsernameMessage(err.response.data.data);
            } else {
                setUsernameMessage("서버 오류가 발생했습니다.");
            }
            setUsernameChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            const response = await api.post("/signup", {
                username,
                nickname,
                password,
            });
            alert(response.data.data[0]);
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data.data) {
                setErrors(err.response.data.data);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
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
            <Paper elevation={3} sx={{p: 4, width: 650, borderRadius: 2}}>
                <Typography variant="h4" align="center" gutterBottom mb={4}>
                    회원가입
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <Box>
                        <TextField
                            label="아이디"
                            variant="outlined"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            sx={{width:424}}
                            autoFocus
                        />
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            sx={{height:56, marginLeft:3}}
                            onClick={handleCheckUsername}
                        >
                            아이디 중복 체크
                        </Button>
                        {usernameMessage && <Box>{usernameMessage}</Box>}
                        {errors.includes("username") && <Box style={{color: "red"}}>아이디는 4글자 이상으로 입력해 주세요.</Box>}
                    </Box>

                    <Box>
                        <TextField
                            label="닉네임"
                            variant="outlined"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            fullWidth
                            autoFocus
                        />

                        {errors.includes("nickname") && <Box style={{color: "red"}}>닉네임은 2글자 이상으로 입력해 주세요.</Box>}
                        {errors.includes("existsNickname") && <Box style={{color: "red"}}>이미 사용 중인 닉네임입니다.</Box>}
                    </Box>

                    <Box>
                        <TextField
                            label="비밀번호"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </Box>

                    <Box>
                        <TextField
                            label="비밀번호 확인"
                            type="password"
                            variant="outlined"
                            value={passwordCheck}
                            onChange={e => setPasswordCheck(e.target.value)}
                            fullWidth
                            autoFocus
                        />

                        {errors.includes("password") &&
                            <Box style={{color: "red"}}>비밀번호는 영문, 숫자, 특수문자 포함 8~20글자 이하로 입력해 주세요.</Box>}
                    </Box>

                    <Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{width: 130, height:56, marginLeft:3}}
                            disabled={!isFormValid}
                        >
                            등록
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            sx={{width: 130, height:56, marginLeft:3}}
                            onClick={() => navigate("/login")}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default Signup;
