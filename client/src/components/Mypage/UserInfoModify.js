import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { auth } from '../../utils/firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PopupForm from "../Forms/PopupForm";
import useFetchWithToken from "../../hooks/useFetchWithToken";

const ProfileEdit = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 휴대폰 인증 상태 변수 추가
  const [phoneNumber, setPhoneNumber] = useState(""); // 초기값을 빈 문자열로 설정
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [popupData, setPopupData] = useState(null);
  const { fetchWithToken } = useFetchWithToken();
  const [userInfo, setUserInfo] = useState({
    localId: "",
    name: "",
    phone: "",
    email: "",
  });
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetchWithToken(`http://localhost:3001/api/users/get-user-info?user_unique_id=${user.id}`);

        if (response.status === 200) {
          setPhoneNumber(response.data.phone || "");
          setUserInfo(response.data);
        } else {
          console.error("회원 정보 조회 실패:", response.message);
        }
      } catch (error) {
        console.error("회원 정보 불러오기 오류:", error);
      }
    };
    fetchUserInfo();
  }, []);
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 수정하기 버튼 클릭 시(이메일, 휴대폰 인증여부 확인(휴대폰 번호는 바뀔때만))
  const handleSave = async () => {
    if (!validateEmail(userInfo.email)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
      return;
    }
    setEmailError("");

    // 휴대폰 번호를 변경했는데 인증이 완료되지 않은 경우
    if (userInfo.phone !== phoneNumber && !isPhoneVerified) {
        setPopupData({
        popupType: 'error', 
        message: '휴대폰 인증이 완료되지 않았습니다.',
        });
        return;
    }

    try {
        const response = await fetchWithToken(`http://localhost:3001/api/users/update-user-info`, { method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            user_unique_id: user.id,
            name: userInfo.name, 
            phone: phoneNumber, 
            email: userInfo.email
         }),
      });
        if (response.status === 200) {
          console.log("회원 정보 수정 성공:");
          setPopupData({
            popupType: "success",
            message: "회원정보 수정이 완료되었습니다.",
          });
        } else {
          console.log("전화번호 중복 오류 발생!");
          setPopupData({
            popupType: "error",
            message: response.data.message, // 서버에서 전달한 메시지 사용
          });
        }
    } catch (error) {
      console.error("회원 정보 수정 오류:", error);
    }
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (value.length > 11) return; // 최대 11자리까지 제한

    // 사용자가 휴대폰 번호를 변경했음을 감지
    if (value !== userInfo.phone) {
      setIsPhoneVerified(false); // 번호를 변경하면 인증 상태 초기화
    }
    setPhoneNumber(value);
  };

const requestVerificationCode = () => {
    // 한국 전화번호 형식 검사
    const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^01[0-9]{8,9}$/; // 한국 번호 형식 (010, 011, 016 등)
    return phoneRegex.test(phone);
    };

    // 요청 전에 전화번호 유효성 확인
    if (!isValidPhoneNumber(phoneNumber)) {
    setPopupData({
        popupType: 'error', 
        message: '유효한 전화번호를 입력하세요.',
    });
    return;
    }
    // reCAPTCHA 초기화
    if (!window.recaptchaVerifier) {
      console.log("reCAPTCHA 초기화 중...");
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // 보이지 않게 설정 (원하는 경우 'normal'로 변경 가능)
        'callback': (response) => {
          // reCAPTCHA 인증이 성공적으로 완료되었을 때 호출됨
          console.log('reCAPTCHA 인증 성공:', response);
        },
        'expired-callback': () => {
          // 인증이 만료되었을 때 호출됨
          console.error('reCAPTCHA 인증이 만료되었습니다.');
        },
        'appVerificationDisabledForTesting': true,  // 테스트 모드에서만 사용하는 설정
      });
    }
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+82${phoneNumber}`, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setPopupData({
          popupType: 'success',
          message: '인증 코드가 발송되었습니다.',
        });
      })
      .catch((error) => {
        console.error('SMS 전송 오류:', error);
        setPopupData({
          popupType: 'error', // 오류 메시지 팝업
          message: 'SMS 전송 중 오류가 발생했습니다.',
        });
      });
  };

  const verifyCode = () => {
    if (confirmationResult) {
      confirmationResult.confirm(verificationCode)
        .then((result) => {
          setPopupData({
            popupType: 'success', // 성공 팝업
            message: '본인 인증 성공',
          });
          setIsPhoneVerified(true); // 인증 성공 시 상태를 true로 설정
        })
        .catch((error) => {
          console.error('인증 코드 오류:', error);
          setPopupData({
            popupType: 'error', // 오류 팝업
            message: '인증 코드가 일치하지 않습니다.',
          });
        });
    } else {
      setPopupData({
        popupType: 'error', // error? info? 
        message: '인증 코드를 요청해주세요.',
      });
    }
  };

  const handleClosePopup = () => {
    setPopupData(null); // 팝업 상태를 null로 설정하여 팝업을 닫음
  };
  
  return (
    <Container>
      <Title>회원정보 수정</Title>
      <InputItemContainer>
        <InputFlex>
          <InputItemDiv>
            <InputTitle>아이디</InputTitle>
            <Input type="text" value={userInfo.localId} disabled />
          </InputItemDiv>
          <InputItemDiv>
            <InputTitle>이름</InputTitle>
            <Input type="text" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
          </InputItemDiv>
        </InputFlex>
        <InputFlex>
          <InputItemDiv>
            <InputTitle>전화번호</InputTitle>
            <InputGroup>
              <Input type="text" value={phoneNumber} onChange={handlePhoneInput} />
              <Button type="button" onClick={requestVerificationCode}>인증 코드 요청</Button>
            </InputGroup>
          </InputItemDiv>
          <InputItemDiv>
            <InputTitle>인증코드</InputTitle>
            <InputGroup>
              <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button type="button" onClick={verifyCode}>인증 코드 확인</Button>
            </InputGroup>
          </InputItemDiv>
        </InputFlex>
        <InputItemDiv>
          <InputTitle>이메일</InputTitle>
          <Input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
          {emailError && <ErrorText>{emailError}</ErrorText>}
        </InputItemDiv>
          
        <SaveButton onClick={handleSave}>수정하기</SaveButton>
        <div id="recaptcha-container"></div>
      </InputItemContainer>
      {popupData && (
        <PopupForm
          message = {popupData.message}
          popupType = {popupData.popupType} 
          onClose= {handleClosePopup}
        />
      )}
    </Container>
  );
};

export default ProfileEdit;

const Container = styled.div`
  width: 100%;
  padding: 3% 15% 10% 15%;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 60px;
`;
const InputFlex = styled.div`
  display: flex;
  width: 100%;
`;

const InputItemContainer = styled.div`
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const InputTitle = styled.h2`
  display: flex;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
`;
const InputItemDiv = styled.div`
  padding: 20px;
  flex: 1;
  align-items: center;
`;
const Input = styled.input`
  all: unset; /* 기본 스타일 제거 */
  border-bottom: 1px solid #999; 
  box-sizing: border-box;
  padding: 15px 10px; 
  width: 350px;  
  font-size: 22px; 

  &:focus {
    border-color: #222;
    outline: none;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px;
  margin-left: 20px;
  border-radius: 4px;
  background-color: #5C3D2E;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const SaveButton = styled(Button)`
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
