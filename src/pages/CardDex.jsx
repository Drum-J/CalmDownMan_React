import {useEffect, useState} from "react";
import api from "../api/axios.jsx";
import {Container, Typography} from "@mui/material";
import SeasonSelect from "../components/card/SeasonSelect.jsx";
import CardGrid from "../components/card/CardGrid.jsx";

export default function CardDex() {
    const [seasonList, setSeasonList] = useState([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState("");
    const [cards, setCards] = useState([]);

    // 시즌 목록 불러오기
    useEffect(() => {
        api.get("/card/seasons").then(res => {
            setSeasonList(res.data.data)
        });
    }, []);

    // 카드 목록 불러오기
    useEffect(() => {
        const url = selectedSeasonId ? `/card/season/${selectedSeasonId}` : "/card";

        api.get(url).then(res => {
            setCards(res.data.data)
        });
    }, [selectedSeasonId]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                카드 도감
            </Typography>
            <SeasonSelect
                seasons={seasonList}
                selectedSeasonId={selectedSeasonId}
                onChange={setSelectedSeasonId}
            />
            <CardGrid cards={cards} />
        </Container>
    )
}