import axios, {AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse} from 'axios';
import {ApiResponse} from "./ApiResponse";

// CustomAxiosError 타입도 이에 맞게 수정
interface CustomAxiosError extends AxiosError {
    response?: AxiosResponse<ApiResponse<string>>;
}

const api: AxiosInstance = axios.create({
    //baseURL: 'http://localhost:8080/api', // local
    baseURL: 'https://api.chimonca.store/api', // prod
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 포함 설정 (리프레시 토큰용)
});

// 요청 인터셉터
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error: CustomAxiosError) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: CustomAxiosError) => {
        const originalRequest = error.config;

        // 401 에러이고 원래 요청이 존재하는 경우
        if (error.response?.status === 401 && originalRequest) {
            try {
                // 리프레시 토큰으로 새로운 액세스 토큰 발급 요청
                // 리프레시 토큰은 쿠키에 있으므로 자동으로 전송됨
                const response = await axios.post<ApiResponse<string>>(
                    '/token/refresh', {}, {
                        //baseURL: 'http://localhost:8080/api', // local
                        baseURL: 'https://api.chimonca.store/api', // prod
                        withCredentials: true
                    });

                // 새로운 액세스 토큰 저장
                const newToken = response.data.data;
                localStorage.setItem('token', newToken);

                // 원래 요청의 헤더에 새 토큰 설정
                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                }

                // 원래 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                // 리프레시 토큰도 만료되었거나 유효하지 않은 경우
                alert("세션이 만료되었습니다. 다시 로그인 해주세요.")
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // 401 또는 403 에러인 경우
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log(error.response.status);
            alert(error.response.data.data);
            window.history.back();
        }

        return Promise.reject(error);
    }
);

export default api;