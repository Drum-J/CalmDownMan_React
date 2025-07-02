import {Navigate} from "react-router-dom";
import {WithChildren} from "../common/WithChildren";
import {JSX, useCallback, useEffect, useState} from "react";
import api from "../common/axios";
import UserContext, {UserInfo} from "../common/UserContext";

export default function RequireAuth({children}: WithChildren): JSX.Element {
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState<UserInfo>(null);

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await api.get('/user/myInfo');
            setUserInfo(response.data.data);
        } catch (error) {
            console.error("Failed to fetch user info", error);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserInfo();
        }
    }, [token, fetchUserInfo]);

    if (!token) {
        return <Navigate to="/login"/>
    }

    // 컨텍스트를 통해 제공될 함수
    const refreshUserInfo = async () => {
        await fetchUserInfo();
    };

    return (
        <UserContext.Provider value={{userInfo, setUserInfo, refreshUserInfo}}>
            {children}
        </UserContext.Provider>
    );

};