// 게임룸 진입 시 초기 데이터 DTO
export interface GameInfoDto {
    otherPlayer: string;
    myCards: MyGameCardDto[];
    currentTurnPlayerId: number;
    player1Id: number;
    player2Id: number;
}

// 카드 제출 시 받는 전체 메시지
export interface SubmitMessageDto {
    currentTurnPlayerId: number;
    fieldCards: Record<number, FieldCardDto | null>; // 필드 번호(1-6)를 key로 가짐
    battleCardDto: BattleCardDto | null;
    myHandCards: MyGameCardDto[] | null;
}

// 필드에 놓인 카드 정보
export interface FieldCardDto {
    gameCardId: number;
    imageUrl: string;
    isFront: boolean; // true: 앞면, false: 뒷면
    isMine: boolean;  // true: 내 카드, false: 상대 카드
}

// 배틀 카드 정보
export interface BattleCardDto {
    gameCardId1:number;
    gameCardId2:number;
}

// 핸드 카드 정보
export interface MyGameCardDto {
    gameCardId: number;
    cardId: number;
    title: string;
    attackType: string;
    grade: string;
    power: number;
    imageUrl: string;
}

// 배틀 완료 후 받는 전체 메세지
export interface BattleMessageDto {
    currentTurnPlayerId: number;
    fieldCards: Record<number, FieldCardDto | null>;
    winnerId: number;
}

