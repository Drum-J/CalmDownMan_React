import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 추가
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

// 리프레시 완료 후 대기 중인 요청에 새 토큰 전달
function onRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

// 리프레시 대기 등록
function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

// 응답 인터셉터: 401 → 토큰 재발급 / 403 → 권한 경고
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        // 401 Unauthorized → 토큰 재발급
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // 리프레시 중이면 Promise 대기
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(instance(originalRequest)); // 재요청
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    "http://localhost:8080/api/token/refresh",
                    {}, // body 없이 요청 (필요하다면 추가)
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.data;
                // 새 토큰 저장
                localStorage.setItem("token", newAccessToken);

                // 대기 중인 요청들 처리
                onRefreshed(newAccessToken);
                isRefreshing = false;

                // 재시도 요청에 새 토큰 부착
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest); // 재요청
            } catch (refreshError) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        // 403 Forbidden → 권한 없음
        if (status === 403) {
            alert(error?.response?.data?.data || "접근 권한이 없습니다.");
            window.history.back(); // 또는 react-router-dom의 navigate(-1)
        }

        return Promise.reject(error);
    }
);

export default instance;
