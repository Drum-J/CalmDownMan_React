import {Navigate} from "react-router-dom";
import {WithChildren} from "../common/WithChildren.ts";
import {JSX} from "react";

export default function RequireAuth({children}: WithChildren): JSX.Element {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login"/>
    }

    return <>{children}</>;
};