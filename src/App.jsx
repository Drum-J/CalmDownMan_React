import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./layout/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import CardDex from "./pages/CardDex.jsx";

function App() {
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
                            </Routes>
                        </Layout>
                    </RequireAuth>
                }>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
