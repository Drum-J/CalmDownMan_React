export type Card = {
    id: number;
    title: string;
    attackType: string;
    grade: string;
    power: number;
    imageUrl: string;
    cardSeason: string;
}

export type Season = {
    id: number;
    title: string;
    imageUrl: string;
}