
import { createContext, useContext } from 'react';

export interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    profileImage: string;
}

interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo | null) => void;
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