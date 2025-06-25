import {Box, Button} from "@mui/material";
import './Modal.css';
import {JSX} from "react";

interface AlertModalProps {
    message: string;
    onClick: () => void;
}

const AlertModal = ({ message, onClick }: AlertModalProps): JSX.Element => {
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

export default AlertModal;