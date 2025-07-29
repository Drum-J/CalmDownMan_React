import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../common/UserContext";

export default function RequireAuth() {
    const token = localStorage.getItem("token");
    const { userInfo } = useUser();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 토큰은 있지만 아직 사용자 정보가 로드되지 않은 경우 로딩 상태를 표시할 수 있습니다.
    // 여기서는 간단히 Outlet을 렌더링하여 자식 컴포넌트가 보이도록 합니다.
    // UserProvider가 App 최상단에서 사용자 정보를 불러오고 있습니다.
    if (token && !userInfo) {
        // Optional: Show a loading spinner while user info is being fetched
        return <div>Loading user...</div>;
    }

    return <Outlet />;
}
