import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WithChildren } from './WithChildren';
import api from './axios';

export interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    profileImage: string;
    point: number;
    rankScore: number;
    winCount: number;
    loseCount: number;
    drawCount: number;
    role: string;
}

interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo | null) => void;
    refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: WithChildren) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const token = localStorage.getItem("token");

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await api.get('/user/myInfo');
            setUserInfo(response.data.data);
        } catch (error) {
            console.error("Failed to fetch user info", error);
            // Token might be invalid, clear it
            localStorage.removeItem("token");
            setUserInfo(null);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserInfo();
        }
    }, [token, fetchUserInfo]);

    const refreshUserInfo = async () => {
        await fetchUserInfo();
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, refreshUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
