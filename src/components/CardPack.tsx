import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import api from "../common/axios";
import {JSX, useState} from "react";
import ConfirmModal from "../modal/ConfirmModal";
import CardOpenResultModal from "../modal/CardOpenResultModal";
import {ApiResponse} from "../common/ApiResponse";
import AlertModal from "../modal/AlertModal";
import {useUser} from "../common/UserContext";

interface CardPackProps {
    id: number;
    title: string;
    imageUrl: string;
}

export default function CardPack({id, title, imageUrl}: CardPackProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);
    const [openResult, setOpenResult] = useState<boolean>(false);
    const [cards, setCards] = useState<Array<any>>([]);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const { refreshUserInfo } = useUser();

    const handleClick = (): void => {
        setOpen(true);
    }

    const alertClose = (): void => {
        setOpenAlert(false);
    }

    const onConfirm = async (): Promise<void> => {
        try {
            const response = await api.post<ApiResponse<string[]>>(`/card/open/${id}`);
            await refreshUserInfo();
            setCards(response.data.data);
            setOpenResult(true);
        } catch (error) {
            setAlertMessage(error.response.data.data);
            setOpenAlert(true);
        } finally {
            setOpen(false);
        }
    }


    return (
        <>
            <Card sx={{maxWidth: 300, m: 2}} onClick={handleClick}>
                <CardMedia
                    component="img"
                    height="400"
                    image={imageUrl}
                    alt={title}
                />
                <CardContent>
                    <Typography variant="h6">{title}</Typography>
                </CardContent>
            </Card>

            {open && <ConfirmModal
                message={`${title}(을)를 오픈할까요?`}
                onConfirm={onConfirm}
                onCancel={() => setOpen(false)}
            />}

            {openAlert && <AlertModal
                message={alertMessage}
                onClick={alertClose}
            />}

            {openResult && (
                <CardOpenResultModal
                    open={openResult}
                    onClose={() => setOpenResult(false)}
                    cards={cards}
                />
            )}
        </>
    );

}