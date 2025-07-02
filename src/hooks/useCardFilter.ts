import { useState, useEffect } from 'react';
import api from '../common/axios';
import { ApiResponse } from '../common/ApiResponse';
import { Card, Season } from '../components/card/dto';

const ATTACK_TYPES = ["TOTAL", "ALL", "바위", "가위", "보"];
const GRADES = ["ALL", "SSR", "SR", "R", "N", "C", "V"];

export function useCardFilter(initialCards: Card[]) {
    const [seasonList, setSeasonList] = useState<Season[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);

    const [selectedSeasonId, setSelectedSeasonId] = useState<string>("ALL");
    const [selectedAttackType, setSelectedAttackType] = useState<string>("TOTAL");
    const [selectedGrade, setSelectedGrade] = useState<string>("ALL");

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

    useEffect(() => {
        let result = [...initialCards];

        if (selectedSeasonId !== 'ALL') {
            const selectedSeason = seasonList.find(s => s.id.toString() === selectedSeasonId);
            if (selectedSeason) {
                result = result.filter(card => card.cardSeason === selectedSeason.title);
            }
        }
        if (selectedAttackType !== 'TOTAL') {
            result = result.filter(card => card.attackType === selectedAttackType);
        }
        if (selectedGrade !== 'ALL') {
            result = result.filter(card => card.grade === selectedGrade);
        }
        setFilteredCards(result);
    }, [selectedSeasonId, selectedAttackType, selectedGrade, initialCards, seasonList]);

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

    return {
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
    };
}