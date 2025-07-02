export type Card = {
    id: number;
    title: string;
    attackType: string;
    grade: string;
    power: number;
    imageUrl: string;
    cardSeason: string;
    count?: number; // count를 선택적 프로퍼티로 추가
}

export type Season = {
    id: number;
    title: string;
    imageUrl: string;
}