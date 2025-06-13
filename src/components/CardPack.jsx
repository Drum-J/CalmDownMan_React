import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import api from "../api/axios.jsx";
import {useState} from "react";
import ConfirmModal from "../modal/ConfirmModal.jsx";
import CardOpenResultModal from "../modal/CardOpenResultModal.jsx";

export default function CardPack({id, title, imageUrl}) {
    const [open, setOpen] = useState(false);
    const [openResult, setOpenResult] = useState(false); // 카드 결과 모달 상태
    const [cards, setCards] = useState([]); // 카드 응답 데이터 저장

    const handleClick = () => {
        setOpen(true);
    }

    const onConfirm = async () => {
        try{
            const response = await api.post(`/card/open/${id}`);
            console.log(response.data.data);
            setCards(response.data.data);
            setOpenResult(true);

        } catch (error) {
            console.log(error);
        }

        setOpen(false);
    }

    return (
        <>
            <Card sx={{maxWidth: 300, m: 2}} onClick={() => handleClick()}>
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
                onConfirm={() => onConfirm()}
                onCancel={() => setOpen(false)}
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