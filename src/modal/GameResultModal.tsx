import { Box, Button, Typography } from "@mui/material";
import './Modal.css';
import { useNavigate } from "react-router-dom";
import { useUser } from "../common/UserContext";

interface GameResultModalProps {
    winnerId: number | null;
    myPlayerId: number;
}

const GameResultModal = ({ winnerId, myPlayerId }: GameResultModalProps) => {
    const navigate = useNavigate();
    const { refreshUserInfo } = useUser();

    const handleGoToLobby = async () => {
        await refreshUserInfo();
        navigate('/');
    };

    const getResultMessage = () => {
        if (winnerId === null) {
            return ""; // Or some default message
        }
        if (winnerId === 0) {
            return "무승부입니다!";
        }
        if (winnerId === myPlayerId) {
            return "승리했습니다!";
        }
        return "패배했습니다.";
    };

    return (
        <Box className="modal">
            <Box className="modal-content">
                <Typography variant="h4" component="h2" gutterBottom>
                    게임 종료
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                    {getResultMessage()}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGoToLobby}
                >
                    로비로 돌아가기
                </Button>
            </Box>
        </Box>
    );
};

export default GameResultModal;
