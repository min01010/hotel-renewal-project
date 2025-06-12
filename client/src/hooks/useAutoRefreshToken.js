import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import useLogout from "./useLogout";

// 리프레시 토큰 유효성 검사 기능만 수행. 만료되면 로그아웃 기능 (네이버/카카오는 api요청시 액세스토큰 자동 재발금됨)
const useAutoRefreshToken = () => {
  const loginState = useSelector((state) => state.user.isLoggedIn);
  const userState = useSelector((state) => state.user.userInfo);
  const method = userState?.method;
  const logout = useLogout();

  useEffect(() => {
    if (!loginState){ // 로그아웃 상태일 때
      return;
    }
    // 리프레시 토큰 유효성 검사 함수
    const checkRefreshTokenValidity = async () => {
      let response;
      try {
        const apiUrl = method === "naver" 
          ? "http://localhost:3001/api/users/refresh-naver-token" 
          : "http://localhost:3001/api/users/refresh-kakao-token";
          
        if (method === 'local'){
          response = await axios.post(
            "http://localhost:3001/api/users/validate-refresh-token", // 유효성 체크 API
            {},
            { withCredentials: true } // 쿠키에 저장된 리프레시 토큰 사용
          );
        } else{ // kakao, naver
          response = await axios.post(
            apiUrl, // 유효성 체크 API
            { user_unique_id: userState.id, method: method },
            {}
          );
          const { access_token } = response.data;
          localStorage.setItem("accessToken", access_token);
        }
        if (!response.data.success) {
          console.log("Refresh token is invalid or expired. Logging out...");
          logout();
        } else {
          console.log("Refresh token is still valid.");
        }
      } catch (error) {
        console.error("Error validating refresh token:", error);
        logout();
      }
    };

    // 1시간마다 리프레시 토큰 유효성 검사 실행
    const interval = setInterval(() => {
      checkRefreshTokenValidity();
    }, 60 * 60 * 1000 ); // 밀리초 단위

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [loginState, logout]);

  return null; // UI 요소가 필요 없는 훅이므로 null 반환
};

export default useAutoRefreshToken;

