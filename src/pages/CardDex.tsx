import {JSX, useEffect, useState} from "react";
import api from "../common/axios";
import { Container, Typography } from "@mui/material";
import SeasonSelect from "../components/card/SeasonSelect";
import CardGrid from "../components/card/CardGrid";
import {ApiResponse} from "../common/ApiResponse";
import {Card, Season} from "../components/card/dto";

export default function CardDex(): JSX.Element {
    const [seasonList, setSeasonList] = useState<Season[]>([]);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
    const [cards, setCards] = useState<Card[]>([]);


    // 시즌 목록 불러오기
    useEffect(() => {
        const fetchSeasons = async (): Promise<void> => {
            try {
                const res = await api.get<ApiResponse<Season[]>>("/card/seasons");
                setSeasonList(res.data.data);
            } catch (error) {
                console.error("시즌 목록을 불러오는데 실패했습니다:", error);
            }
        };

        fetchSeasons();
    }, []);

    // 카드 목록 불러오기
    useEffect(() => {
        const fetchCards = async (): Promise<void> => {
            try {
                const url = selectedSeasonId ? `/card/season/${selectedSeasonId}` : "/card";
                const res = await api.get<ApiResponse<Card[]>>(url);
                setCards(res.data.data);
            } catch (error) {
                console.error("카드 목록을 불러오는데 실패했습니다:", error);
            }
        };

        fetchCards();
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
    );
}