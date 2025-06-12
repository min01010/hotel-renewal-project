import React, { useState } from "react";
import styled from "styled-components";
import useFetchWithToken from "../../hooks/useFetchWithToken";
import { useSelector } from "react-redux";
import PopupForm from "../Forms/PopupForm";

const PasswordChange = () => {
  const user = useSelector((state) => state.user.userInfo);
  const { fetchWithToken } = useFetchWithToken();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupData, setPopupData] = useState(null);
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 불일치 오류를 위한 상태 추가

  const handlePasswordChange = async () => {

    if (!currentPassword) {
      setPasswordError("기존 비밀번호를 입력해주세요.");
      return;
    }
    
    // 새 비밀번호와 확인 비밀번호가 일치하지 않으면 오류 메시지 상태를 설정
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 길이 확인
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setPasswordError("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    // 비밀번호 일치 오류가 없다면 오류 메시지 상태 초기화
    setPasswordError("");

    try {
      const response = await fetchWithToken("http://localhost:3001/api/users/update-user-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_unique_id: user.id,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (response.status !== 200) {
        setPopupData({
          popupType: "error",
          message: response.data.message || "알 수 없는 오류가 발생했습니다.",
        });
      } else {
        setPopupData({
          popupType: "success",
          message: response.data.message || "비밀번호가 성공적으로 변경되었습니다.",
        });
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      setPopupData({
        popupType: "error",
        message: "서버 오류가 발생했습니다.",
      });
    }
  };

  const handleClosePopup = () => {
    setPopupData(null); // 팝업 상태를 null로 설정하여 팝업을 닫음
    setCurrentPassword(""); // 기존 비밀번호 입력 필드 초기화
    setNewPassword(""); // 새 비밀번호 입력 필드 초기화
    setConfirmPassword(""); // 새 비밀번호 확인 입력 필드 초기화
  };

  return (
    <Container>
      <Title>비밀번호 변경</Title>
      <InputItemContainer>
        <InputItemDiv>
          <InputTitle>기존 비밀번호</InputTitle>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </InputItemDiv>
        <InputFlex>
          <InputItemDiv>
            <InputTitle>새 비밀번호</InputTitle>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputItemDiv>
          <InputItemDiv>
            <InputTitle>새 비밀번호 확인</InputTitle>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputItemDiv>
        </InputFlex>
        {/* 새 비밀번호 확인 불일치 시 빨간 문구 */}
        {passwordError && <ErrorText>{passwordError}</ErrorText>}

        <ChangeButton onClick={handlePasswordChange}>변경하기</ChangeButton>
      </InputItemContainer>
      
      {popupData && (
        <PopupForm
          message={popupData.message}
          popupType={popupData.popupType}
          onClose={handleClosePopup}
        />
      )}
    </Container>
  );
};

export default PasswordChange;

const Container = styled.div`
  width: 100%;
  padding: 3% 15% 10% 15%;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 60px;
`;
const InputItemContainer = styled.div`
  font-family: 'Pretendard', sans-serif;
  width: 100%;
`;
const InputTitle = styled.h2`
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
`;
const InputFlex = styled.div`
  display: flex;
  width: 100%;
`;

const Input = styled.input`
  all: unset; /* 기본 스타일 제거 */
  border-bottom: 1px solid #999; 
  box-sizing: border-box;
  padding: 15px 10px; 
  width: 350px;  
  font-size: 22x; 

  &:focus {
    border-color: #222;
    outline: none;
  }
`;
const InputItemDiv = styled.div`
  padding: 20px 0px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ChangeButton = styled.button`
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

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;
