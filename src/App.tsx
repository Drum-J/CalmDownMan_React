import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import RequireAuth from "./components/RequireAuth";
import CardDex from "./pages/CardDex";
import Trade from "./pages/Trade";
import TradeDetail from "./pages/TradeDetail";
import {JSX} from "react";
import SelectCardPage from "./pages/SelectCardPage";

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