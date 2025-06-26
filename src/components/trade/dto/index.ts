export interface Trade {
    tradeId: number;
    title: string;
    content: string;
    tradeStatus: string;
    grade: string;
    accountId: number;
    username: string;
    nickname: string;
    profileImage: string;
    cardCount: number;
}

export interface StatusOption {
    value: string;
    label: string;
}

export interface GradeOption {
    value: number;
    label: string;
}

export interface TradeCardDetail {
    cardId: number;
    title: string;
    grade: string;
    count: number;
    imageUrl: string;
}

export interface ListState {
    page: number;
    status: string;
    grade: string;
    rowsPerPage: number;
}