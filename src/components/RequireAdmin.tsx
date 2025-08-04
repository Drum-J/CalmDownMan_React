import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../common/UserContext';
import AlertModal from "../modal/AlertModal";

export default function RequireAdmin() {
    const { userInfo } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userInfo.role !== 'ADMIN') {
        return (
            <AlertModal
                message="관리자만 접근할 수 있는 페이지입니다."
                onClick={() => navigate('/')}
            />
        );
    }

    return <Outlet />;
}
