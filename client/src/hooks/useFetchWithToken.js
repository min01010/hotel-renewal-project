import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useLogout from "./useLogout";

const useFetchWithToken = () => {
  const [error, setError] = useState(null);
  const logout = useLogout();
  const userState = useSelector((state) => state.user.userInfo);
  const method = userState?.method;
  
  // 리프레시 토큰 유효성 검사 (네이버/카카오는 액세스 토큰 발급)
  const checkRefreshTokenValidity = async () => {
    try {
      let response;
      const apiUrl =
        method === "naver"
          ? "http://localhost:3001/api/users/refresh-naver-token"
          : "http://localhost:3001/api/users/refresh-kakao-token";

      if (method === "local") {
        await refreshAccessToken();
        response = await axios.post(
          "http://localhost:3001/api/users/validate-refresh-token",
          {},
          { withCredentials: true }
        );
        if (!response.data.success) {
          console.log("Refresh token is invalid or expired. Logging out...");
          logout();
        }
        // if (response.data.success) {
        //   await refreshAccessToken();
        // }
      } else { //카카오, 네이버 
        response = await axios.post(apiUrl, {
          user_unique_id: userState.id,
          method: method,
        });
        const { access_token } = response.data;
        localStorage.setItem("accessToken", access_token);
      }

      if (!response.data.success) {
        console.log("Refresh token is invalid or expired. Logging out...");
        logout();
      }
      // refreshAccessToken이 끝난 후 최신 액세스 토큰 반환
      const latestAccessToken = localStorage.getItem("accessToken");
      return latestAccessToken;
    } catch (err) {
      console.error("Error checking refresh token validity:", err);
      logout();
    }
  };

  // 액세스 토큰 갱신
  const refreshAccessToken = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const { exp: accessExp } = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      //10분 이하일 경우
      if (accessExp - currentTime <= 10 * 60) {
        const refreshResponse = await axios.post(
          "http://localhost:3001/api/users/refresh-token",
          { user_id: userState.id },
          { withCredentials: true }
        );
        const { accessToken: newAccessToken } = refreshResponse.data;
        localStorage.setItem("accessToken", newAccessToken);
        console.log("Access token refreshed.");
      }
    } catch (err) {
      console.error("Error refreshing access token:", err);
      logout();
    }
  };

  // 최종 API 요청
  const fetchWithToken  = async (url, options = {}) => {
    try {
      const newAccessToken = await checkRefreshTokenValidity(); // 최신 토큰 받기
      if (!newAccessToken) throw new Error("Failed to refresh access token");

      const finalResponse = await axios({
        url, // API 요청할 URL (useFetchWithToken을 사용할 때 인자로 전달됨)
        method: options.method,
        headers: {
          Authorization: `Bearer ${newAccessToken}`, // 가져온 액세스 토큰을 Authorization 헤더에 추가
          ...options.headers,
        },
        data: options.body, // body 데이터를 data로 전달
        validateStatus: (status) => status < 500, // 500 이상만 에러 처리 (409는 예외 발생 안 함)
      });
      //axios로 인해서 data로 한번 더 묶여서 풀어줘야함
      const { data } = finalResponse.data;
      //const { data } = finalResponse;
      return { status: finalResponse.status, data };
      // 다른방법> ...(spread 연산자)사용: finalResponse.data의 모든 속성을 그대로 펼쳐서 새로운 객체에 포함
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("Authentication expired. Logging out...");
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        logout();
      } else {
        console.error("Request failed:", err);
        setError(err.message);
      }
    }
  };

  return { fetchWithToken , error };
};

export default useFetchWithToken;
