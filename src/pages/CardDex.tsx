import {JSX, useEffect, useState} from "react";
import api from "../common/axios";
import {Box, Container, Typography} from "@mui/material";
import FilterSelect from "../components/card/FilterSelect"; // 새로 만든 공용 컴포넌트 import
import CardGrid from "../components/card/CardGrid";
import {ApiResponse} from "../common/ApiResponse";
import {Card, Season} from "../components/card/dto";

const ATTACK_TYPES = ["TOTAL", "ALL", "바위", "가위", "보"];
const GRADES = ["ALL", "SSR", "SR", "R", "N", "C", "V"];

export default function CardDex(): JSX.Element {
    const [seasonList, setSeasonList] = useState<Season[]>([]);
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);

    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("ALL");
    const [selectedAttackType, setSelectedAttackType] = useState<string>("ALL");
    const [selectedGrade, setSelectedGrade] = useState<string>("ALL");

    useEffect(() => {
        const fetchSeasons = async (): Promise<void> => {
            try {
                const res = await api.get<ApiResponse<Season[]>>("/card/seasons");
                setSeasonList(res.data.data);
            } catch (error) { console.error("시즌 목록을 불러오는데 실패했습니다:", error); }
        };
        fetchSeasons();
    }, []);

    useEffect(() => {
        const fetchAllCards = async (): Promise<void> => {
            try {
                const res = await api.get<ApiResponse<Card[]>>("/card");
                setAllCards(res.data.data);
            } catch (error) { console.error("전체 카드 목록을 불러오는데 실패했습니다:", error); }
        };
        fetchAllCards();
    }, []);

    useEffect(() => {
        let result = [...allCards];

        if (selectedSeasonId) {
            const selectedSeason = seasonList.find(s => s.id.toString() === selectedSeasonId);
            if (selectedSeason) result = result.filter(card => card.cardSeason === selectedSeason.title);
        }
        if (selectedAttackType !== 'TOTAL') {
            result = result.filter(card => card.attackType === selectedAttackType);
        }
        if (selectedGrade !== 'ALL') {
            result = result.filter(card => card.grade === selectedGrade);
        }
        setFilteredCards(result);
    }, [selectedSeasonId, selectedAttackType, selectedGrade, allCards, seasonList]);

    // 각 필터에 맞는 옵션 배열 생성
    const seasonOptions = [
        { value: "ALL", label: "전체 시즌" },
        ...seasonList.map(s => ({ value: s.id.toString(), label: s.title }))
    ];

    const attackTypeOptions = ATTACK_TYPES.map(type => ({
        value: type,
        label: type === 'TOTAL' ? '전체 타입' : type
    }));

    const gradeOptions = GRADES.map(grade => ({
        value: grade,
        label: grade === 'ALL' ? '전체 등급' : grade
    }));

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' , gap: 2, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    카드 도감
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: 'gray' }}>
                    (총 {filteredCards.length}장)
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
        </Container>
    );
}