import './App.css'
import {JSX} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
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
import GameLobby from "./pages/GameLobby";
import GameRoom from "./pages/GameRoom";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>

                <Route path={"/*"} element={
                    <RequireAuth>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/cardDex" element={<CardDex/>}/>
                                <Route path="/trade" element={<Trade/>}/>
                                <Route path="/trade/:id" element={<TradeDetail />} />
                                <Route path="/selectCards" element={<SelectCardPage />} />
                                <Route path="/trade/create" element={<TradePostCreate />} />
                                <Route path="/game/lobby" element={<GameLobby />} />
                                <Route path="/game/room" element={<GameRoom />} />

                                {/* 마이페이지 라우트 설정 */}
                                <Route path="/mypage" element={<MyPage />}>
                                    <Route index element={<MyInfo />} />
                                    <Route path="cards" element={<MyCards />} />
                                    <Route path="posts" element={<MyPosts />} />
                                    <Route path="requests" element={<MyRequests />} />
                                </Route>
                            </Routes>
                        </Layout>
                    </RequireAuth>
                }>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;