import {Box, Button, Stack} from "@mui/material";
import './Modal.css';
import {JSX} from "react";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps): JSX.Element => {
    return (
        <Box className="modal">
            <Box className="modal-content">
                <p>{message}</p>
                <Stack spacing={2} direction="row" justifyContent="center">
                    <Button
                        onClick={onCancel}
                        variant="contained"
                        color="secondary"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="contained"
                        color="primary"
                    >
                        확인
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ConfirmModal;
