import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import IntegrationPopup from "../components/Forms/PopupForm";

const NaverCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code"); // 인증 코드(서버에 액세스 토큰을 요청하는 데 사용)
    const state = query.get("state"); // 랜덤한 값, 응답에 포함된 state 값이 요청 시 보낸 값과 일치하는지 확인하여 인증 과정의 무결성을 검증
    if (code) {
    // 서버에 인증 코드를 전달하여 로그인 처리
      axios
        .post("http://localhost:3001/api/users/naver-login", { code, state }, { withCredentials: true })
        .then((response) => {
          if (response.data.showPopup) {
            // 팝업 띄워야 하는 경우(로컬 or 카카오 회원 존재하는 경우)
            setPopupData({
              popupType: response.data.popupType,
              message: response.data.message,
              userUniqueId: response.data.userUniqueId,
              naverId: response.data.naverId,
            });
          } else if (response.data.success) { // 회원가입/로그인 바로 가능한 경우(로컬 or 카카오 회원 존재 x / 회원통합 완료 후 로그인 시시)
            const { user, access_token } = response.data; // 서버에서 받은 리프레시 토큰도 함께 받기
            localStorage.setItem("accessToken", access_token);

            dispatch(login({
              id: user.id,
              user_name: user.user_name,
              method: 'naver'  // method만 추가
            }));
            navigate("/"); // 로그인 후 홈으로 리다이렉트
          } else {
            setError("네이버 로그인에 실패했습니다.");
          }
        })
        .catch((err) => {
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
        id: popupData.naverId,
        method: "naver",
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
      <h2>네이버 로그인 처리 중...</h2>
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

export default NaverCallback;
