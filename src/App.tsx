import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import RequireAuth from "./components/RequireAuth";
import CardDex from "./pages/CardDex";
import Trade from "./pages/Trade";
import TradeDetail from "./pages/TradeDetail";
import SelectCardPage from "./pages/SelectCardPage";
import TradePostCreate from "./pages/TradePostCreate";
import MyPage from "./pages/mypage/MyPage";
import MyRequests from "./pages/mypage/MyRequests";
import MyInfo from "./pages/mypage/MyInfo";
import MyPosts from "./pages/mypage/MyPosts";
import MyCards from "./pages/mypage/MyCards";
import GameRecords from "./pages/mypage/GameRecords";
import GameLobby from "./pages/GameLobby";
import GameRoom from "./pages/GameRoom";
import { UserProvider } from './common/UserContext';

import Logout from './pages/Logout';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/signup",
        element: <Signup/>,
    },
    {
        path: "/logout", // 로그아웃 라우트 추가
        element: <Logout />,
    },
    {
        element: <RequireAuth/>, // 인증 체크
        children: [
            {
                element: <Layout/>, // 레이아웃 적용
                children: [
                    { path: "/", element: <Home/> },
                    { path: "/cardDex", element: <CardDex/> },
                    { path: "/trade", element: <Trade/> },
                    { path: "/trade/:id", element: <TradeDetail/> },
                    { path: "/selectCards", element: <SelectCardPage/> },
                    { path: "/trade/create", element: <TradePostCreate/> },
                    { path: "/game/lobby", element: <GameLobby/> },
                    { path: "/gameRoom/:gameRoomId", element: <GameRoom/> },
                    {
                        path: "/mypage",
                        element: <MyPage/>,
                        children: [
                            { index: true, element: <MyInfo/> },
                            { path: "cards", element: <MyCards/> },
                            { path: "posts", element: <MyPosts/> },
                            { path: "requests", element: <MyRequests/> },
                            { path: "gameRecords", element: <GameRecords/> },
                        ],
                    },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <UserProvider>
            <RouterProvider router={router}/>
        </UserProvider>
    );
}

export default App;
