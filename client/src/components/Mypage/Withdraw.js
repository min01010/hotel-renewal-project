import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import PopupForm from "../Forms/PopupForm";
import useLogout from "../../hooks/useLogout";
import { useSelector } from "react-redux";
import useFetchWithToken from "../../hooks/useFetchWithToken";

const Withdraw = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [popupData, setPopupData] = useState(null);
  const logout = useLogout();
  const { fetchWithToken } = useFetchWithToken();  // 훅을 호출하여 fetchWithToken 가져오기
  // 탈퇴 버튼 클릭 시 확인 팝업 표시
  const handleWithdrawClick = () => {
    setPopupData({
      popupType: "info",
      message: "회원 탈퇴 후 복구가 불가능합니다. 정말 탈퇴하시겠습니까?",
      withdraw: true, // onAccept & onReject 사용
    });
  };

  // 회원 탈퇴 API 요청
  const handleWithdrawConfirm = async () => {
    try {
        const response = await fetchWithToken("http://localhost:3001/api/users/withdraw", { method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_unique_id: user.id }),
          })
      await axios.post("http://localhost:3001/api/users/withdraw", {
        user_unique_id: user.id,
      });
      console.log("예약 성공", response);
      // 탈퇴 성공 시 성공 팝업 띄우기
      setPopupData({
        popupType: "success",
        message: "회원 탈퇴가 완료되었습니다.",
        withdraw: false, // onClose만 사용
      });

    } catch (error) {
      console.error("회원 탈퇴 실패:", error);

      // 탈퇴 실패 시 에러 팝업 띄우기
      setPopupData({
        popupType: "error",
        message: "탈퇴 중 오류가 발생했습니다.",
        withdraw: false, // onClose만 사용
      });
    }
  };

  const handlePopupClose = async () => {
    logout(false);  // API 호출 없이 로그아웃만 처리
  }
  return (
    <Container>
      <Title>회원 탈퇴</Title>
      <InfoMessage>회원 탈퇴 후 복구가 불가능합니다. 또한 모든 연동 계정이 삭제됩니다.</InfoMessage>
      <ButtonDiv>
        <WithdrawButton onClick={handleWithdrawClick}>탈퇴하기</WithdrawButton>
      </ButtonDiv>

      {popupData && (
        <PopupForm
          message={popupData.message}
          popupType={popupData.popupType}
          {...(popupData.withdraw && {
            onAccept: handleWithdrawConfirm,
            onReject: () => setPopupData(null),
          })} // 탈퇴 확인 시에만 사용
          {...(!popupData.withdraw && {
            onClose: handlePopupClose,
          })} // 성공 or 실패 팝업은 onClose만 사용
        />
      )}
    </Container>
  );
};

export default Withdraw;

const Container = styled.div`
  flex-wrap: wrap;
  margin: 3% 15% 10% 15%;
  min-height: 500px;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 30px;
`;
const InfoMessage = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  margin: 100px 0px 50px;
  text-align: center;
`;
const ButtonDiv = styled.div`
  font-family: 'Pretendard', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WithdrawButton = styled.button`
  margin: 80px auto 0px;
  display: block;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #5C3D2E;
  padding: 20px 100px;
  color: #5C3D2E;
    &:hover {
    color: white;
    background-color: #5C3D2E;
  }
`;

