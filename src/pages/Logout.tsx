import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../common/axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await api.post('/token/logout');
            } catch (error) {
                console.error('로그아웃 API 호출 실패:', error);
            } finally {
                localStorage.removeItem('token');
                alert('로그아웃 되었습니다.');
                navigate('/login', { replace: true });
            }
        };

        performLogout();
    }, [navigate]);

    return <div>로그아웃 중...</div>;
};

export default Logout;
