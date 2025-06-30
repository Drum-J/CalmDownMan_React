import {Navigate} from "react-router-dom";
import {WithChildren} from "../common/WithChildren";
import {JSX, useEffect, useState} from "react";
import api from "../common/axios";
import UserContext from "../common/UserContext";

export default function RequireAuth({children}: WithChildren): JSX.Element {
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState<{
        id: number;
        username: string;
        nickname: string;
        profileImage: string;
    } | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const response = await api.get('/user/myInfo');
            setUserInfo(response.data.data);
        };

        if (token) {
            fetchUserInfo();
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login"/>
    }

    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    );

};