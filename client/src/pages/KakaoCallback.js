import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import IntegrationPopup from "../components/Forms/PopupForm";
import { useSelector } from "react-redux";

const KakaoCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const loginCheck = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code"); // 카카오 인증 코드
    const state = query.get("state"); // 상태 값 

    if (code) {
      console.log("카카오 로그인 인증 코드:", code);

      // 서버에 인증 코드를 전달하여 로그인 처리
      axios
        .post("http://localhost:3001/api/users/kakao-login", { code, state }, {withCredentials: true})
        .then((response) => {
          if (response.data.showPopup) {
            // 팝업 띄워야 하는 경우(로컬 or 네이버 회원 존재하는 경우)
            setPopupData({
              popupType: response.data.popupType,
              message: response.data.message,
              userUniqueId: response.data.userUniqueId,
              kakaoId: response.data.kakaoId,
            });
          } else if (response.data.success) {
            // 로그인 성공
            const { user, access_token } = response.data;
            localStorage.setItem("accessToken", access_token);

            // Redux에 사용자 정보 저장
            dispatch(
              login({
                id: user.id,
                user_name: user.user_name,
                method: "kakao",
              }));
            // 로그인 성공 후 리다이렉트
            console.log("loginCheck?",loginCheck);
            navigate("/");
          } else {
            setError("카카오 로그인에 실패했습니다.");
          }
        })
        .catch((err) => {
          console.error("Kakao login error:", err.response?.data || err.message);
          setError(err.response?.data?.message || "서버 오류가 발생했습니다.");
        });
    } else {
      setError("로그인 실패: 인증 코드를 찾을 수 없습니다.");
    }
  }, [dispatch, navigate]);

   // 팝업에서 통합 요청 수락
   const handleAcceptIntegration = () => {
    if (!popupData) return;

    axios
      .post("http://localhost:3001/api/users/accept-integration", {
        userUniqueId: popupData.userUniqueId,
        id: popupData.kakaoId,
        method: "kakao",
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message); // 팝업 메시지 표시
        // 통합 성공 시 리다이렉트
        navigate("/login"); // 통합 이후 로그인 페이지로 이동
        }
      })
      .catch((err) => {
        console.error("통합 처리 중 오류:", err.response?.data || err.message);
        setError(err.response?.data?.message || "통합 처리 중 오류가 발생했습니다.");
      });
  };

  // 팝업에서 통합 요청 거절
  const handleRejectIntegration = () => {
    console.log("사용자가 통합 요청을 거절했습니다.");
    navigate("/login"); // 거절 시 로그인 페이지로 이동
  };
  
  return (
    <div>
      <h2>카카오 로그인 처리 중...</h2>
      {error && <p>{error}</p>}
      {popupData && (
        <IntegrationPopup
          message={popupData.message}
          popupType={popupData.popupType}
          onAccept={handleAcceptIntegration}
          onReject={handleRejectIntegration}
        />
      )}
    </div>
  );
};

export default KakaoCallback;
