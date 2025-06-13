import {Box, Button} from "@mui/material";
import './Modal.css';

export const AlertModal = ({ message, onClick }) => {
    return (
        <Box className="modal">
            <Box className="modal-content">
                <p>{message}</p>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onClick}
                >
                    확인
                </Button>
            </Box>
        </Box>
    );
};