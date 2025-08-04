import {JSX, useEffect, useState} from "react";
import api from "../common/axios";
import {Box, Container, Typography} from "@mui/material";
import FilterSelect from "../components/card/FilterSelect";
import CardGrid from "../components/card/CardGrid";
import {ApiResponse} from "../common/ApiResponse";
import {Card} from "../components/card/dto";
import { useCardFilter } from "../hooks/useCardFilter";

export default function CardDex(): JSX.Element {
    const [allCards, setAllCards] = useState<Card[]>([]);

    useEffect(() => {
        const fetchAllCards = async (): Promise<void> => {
            try {
                const res = await api.get<ApiResponse<Card[]>>("/card");
                setAllCards(res.data.data);
            } catch (error) { console.error("전체 카드 목록을 불러오는데 실패했습니다:", error); }
        };
        fetchAllCards();
    }, []);

    const {
        filteredCards,
        selectedSeasonId,
        setSelectedSeasonId,
        selectedAttackType,
        setSelectedAttackType,
        selectedGrade,
        setSelectedGrade,
        seasonOptions,
        attackTypeOptions,
        gradeOptions
    } = useCardFilter(allCards);

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' , gap: 2, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    카드 도감
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: 'gray' }}>
                    (총 {filteredCards.length}종)
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' , gap: 2, mb: 2 }}>
                <FilterSelect
                    label="시즌"
                    value={selectedSeasonId}
                    onChange={setSelectedSeasonId}
                    options={seasonOptions}
                />
                <FilterSelect
                    label="공격 타입"
                    value={selectedAttackType}
                    onChange={setSelectedAttackType}
                    options={attackTypeOptions}
                />
                <FilterSelect
                    label="등급"
                    value={selectedGrade}
                    onChange={setSelectedGrade}
                    options={gradeOptions}
                />
            </Box>

            <CardGrid cards={filteredCards} />
        </Box>
    );
}