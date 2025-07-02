import { createContext, useContext } from 'react';

export interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    profileImage: string;
    point: number;
    rankScore: number;
}

interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo | null) => void;
    refreshUserInfo: () => Promise<void>; // 사용자 정보를 새로고침하는 함수
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;