import {JSX, useEffect, useState} from "react";
import api from "../../common/axios";
import {Box, Container, Typography} from "@mui/material";
import FilterSelect from "../../components/card/FilterSelect";
import CardGrid from "../../components/card/CardGrid";
import {ApiResponse} from "../../common/ApiResponse";
import {Card} from "../../components/card/dto";
import { useCardFilter } from "../../hooks/useCardFilter";

const OWNED_STATUS = ["ALL", "OWNED", "NOT_OWNED"];

export default function MyCards(): JSX.Element {
    const [mergedCards, setMergedCards] = useState<Card[]>([]);
    const [finalFilteredCards, setFinalFilteredCards] = useState<Card[]>([]);
    const [selectedOwnedStatus, setSelectedOwnedStatus] = useState<string>("OWNED");

    useEffect(() => {
        const fetchAndMergeCards = async (): Promise<void> => {
            try {
                const allCardsRes = await api.get<ApiResponse<Card[]>>("/card");
                const myCardsRes = await api.get<ApiResponse<Card[]>>("/card/mine");

                const allCards = allCardsRes.data.data;
                const myCards = myCardsRes.data.data;

                const myCardsMap = new Map(myCards.map(card => [card.id, card.count]));

                const merged = allCards.map(card => ({
                    ...card,
                    count: myCardsMap.get(card.id) || 0
                }));

                setMergedCards(merged);

            } catch (error) { console.error("카드 목록을 불러오거나 병합하는데 실패했습니다:", error); }
        };
        fetchAndMergeCards();
    }, []);

    const {
        filteredCards: commonFilteredCards,
        selectedSeasonId,
        setSelectedSeasonId,
        selectedAttackType,
        setSelectedAttackType,
        selectedGrade,
        setSelectedGrade,
        seasonOptions,
        attackTypeOptions,
        gradeOptions
    } = useCardFilter(mergedCards);

    useEffect(() => {
        let result = [...commonFilteredCards];

        if (selectedOwnedStatus !== 'ALL') {
            if (selectedOwnedStatus === 'OWNED') {
                result = result.filter(card => card.count && card.count > 0);
            } else if (selectedOwnedStatus === 'NOT_OWNED') {
                result = result.filter(card => !card.count || card.count === 0);
            }
        }
        setFinalFilteredCards(result);
    }, [selectedOwnedStatus, commonFilteredCards]);

    const ownedStatusOptions = OWNED_STATUS.map(status => ({
        value: status,
        label: status === 'ALL' ? '전체' : (status === 'OWNED' ? '보유' : '미보유')
    }));

    // 보유 여부 필터링 전의 카드 목록을 기준으로 카운트 계산
    const totalFilteredCount = commonFilteredCards.length;
    const ownedFilteredCount = commonFilteredCards.filter(card => card.count && card.count > 0).length;

    // 수량 표시 텍스트를 결정하는 로직
    const getCountText = () => {
        if (selectedOwnedStatus === 'ALL') {
            return `(${ownedFilteredCount}/${totalFilteredCount}종)`;
        }
        return `(${finalFilteredCards.length}종)`;
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' , gap: 2, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    내 카드
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: 'gray' }}>
                    {getCountText()}
                </Typography>
            </Box>


            <Box sx={{ display: 'flex', justifyContent: 'center' , gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <FilterSelect
                    label="시즌"
                    value={selectedSeasonId}
                    onChange={setSelectedSeasonId}
                    options={seasonOptions}
                    minWidth={240}
                />
                <FilterSelect
                    label="공격 타입"
                    value={selectedAttackType}
                    onChange={setSelectedAttackType}
                    options={attackTypeOptions}
                    minWidth={240}
                />
                <FilterSelect
                    label="등급"
                    value={selectedGrade}
                    onChange={setSelectedGrade}
                    options={gradeOptions}
                    minWidth={240}
                />
                <FilterSelect
                    label="보유 여부"
                    value={selectedOwnedStatus}
                    onChange={setSelectedOwnedStatus}
                    options={ownedStatusOptions}
                    minWidth={240}
                />
            </Box>

            <CardGrid cards={finalFilteredCards} />
        </Container>
    );
}