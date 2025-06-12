import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PopupForm from "./PopupForm";

const SignupForm = () => {
  const [localId, setId] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 휴대폰 인증 상태 변수 추가
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(""); // 이메일 오류 상태 추가
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // 비밀번호 확인 오류 상태 추가
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isIdAvailable, setIsIdAvailable] = useState(true); // 아이디 사용 가능 여부 상태
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    setEmailError("");
    setConfirmPasswordError("");
  }, [email, password, confirmPassword]);

  useEffect(() => {
    if (popupData) {
      console.log("popupData 업데이트됨:", popupData);
    }
  }, [popupData]); 

  // const handlePopupClose = () => {
  //   setPopupData(null); // 팝업 상태 초기화
  // };
  
  // 아이디 중복 체크 함수
  const checkIdAvailability = async () => {
    try {
      if(!localId){
        setPopupData({
          popupType: 'error', 
          message: '아이디가 입력되지 않았습니다.',
        });
        return;
      }
      const response = await axios.get(`http://localhost:3001/api/users/check-id?localId=${localId}`);
      if (!response.data.userExists) {
        setPopupData({
          popupType: 'info', 
          message: '아이디가 사용 가능합니다.',
        });
        setIsIdAvailable(true); // 아이디 사용 가능
      } else {
        setPopupData({
          popupType: 'error', 
          message: '이미 사용 중인 아이디입니다.',
        });
        setIsIdAvailable(false); // 아이디 사용 불가
      }
    } catch (error) {
      console.error("아이디 중복 체크 오류:", error);
      setPopupData({
        popupType: 'error', // 오류 팝업
        message: '서버 오류가 발생했습니다.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("비밀번호 ",password);
    console.log("비밀번호 확인 ",confirmPassword);

    // const email = e.target.email.value; // 최신 이메일 값 직접 가져오기
    // const password = e.target.password.value; // 최신 비밀번호 값 직접 가져오기
    // const confirmPassword = e.target.confirmPassword.value; // 최신 비밀번호 값 직접 가져오기

    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 6) {
      setConfirmPasswordError("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 휴대폰 인증이 완료되었는지 확인
    if (!isPhoneVerified) {
      setPopupData({
        popupType: 'error', 
        message: '휴대폰 인증이 완료되지 않았습니다.',
      });
      return;
    }

     // 아이디 사용 가능 여부 확인
     if (!isIdAvailable) {
      setPopupData({
        popupType: 'error', // 오류 팝업
        message: '이미 사용 중인 아이디입니다.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/users/signup', {
        id: localId,
        name: name,
        mobile: phoneNumber,
        email: email,
        password: password,
      },);

      if (response.status === 201) {
        setPopupData({
          popupType: 'success', // 성공 팝업
          message: '회원가입이 완료되었습니다.',
        });
        navigate('/login');
      }
      else if (response.status === 200 && response.data.success === false) {
        // 팝업 띄워야 하는 경우(로컬 or 네이버 회원 존재하는 경우) // 통합하시겠습니까? 팝업
        setPopupData({
          popupType: response.data.popupType,
          message: response.data.message,
          userUniqueId: response.data.userUniqueId,
          localId: response.data.localId,
          integration: true
        });
      }

    } catch (error) {
      console.error('회원가입 오류:', error);
      setPopupData({
        popupType: 'error', 
        message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.', //  서버오류 팝업
      });
    }
  };

  // 팝업에서 통합 요청 수락
  const handleAcceptIntegration = () => {
    if (!popupData) return;
    axios
      .post("http://localhost:3001/api/users/accept-integration", {
        userUniqueId: popupData.userUniqueId,
        id: popupData.localId,
        method: "local",
        password: password,
        username: name
      })
      .then((response) => {
        if (response.data.success) {
          setPopupData({
            popupType: 'success',
            message: response.data.message,
            navigate: '/login' // 통합 이후 로그인 페이지로 이동
          }); // 팝업 메시지 표시  
        }
      })
      .catch((err) => {
        console.error("통합 처리 중 오류:", err.response?.data || err.message);
        setPopupData({
          popupType: 'error', // 오류 팝업
          message: err.response?.data?.message || "통합 처리 중 오류가 발생했습니다.",
        }); 
      });
  };

  // 팝업에서 통합 요청 거절
  const handleRejectIntegration = () => {
    console.log("사용자가 통합 요청을 거절했습니다.");
    navigate("/login"); // 거절 시 로그인 페이지로 이동
  };

  const handlePhoneInput = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    if (input.length > 11) return; // 최대 11자리까지 제한
    setPhoneNumber(input);
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
          popupType: 'info',  // 팝업 타입 설정 (예: 정보, 오류 등)
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
            message: '본인 인증에 성공하였습니다.',
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
    } else{
      setPopupData({
        popupType: 'error', // error? info? 
        message: '인증 코드를 요청해주세요.',
      });
    }
  };

  const handleClosePopup = () => {
    if (popupData.navigate){
      navigate(popupData.navigate); // 페이지 이동
    }
    setPopupData(null); // 팝업 상태를 null로 설정하여 팝업을 닫음
  };


  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <InputFlex>
          <InputItemDiv>
            <InputTitle>아이디<Essential>&nbsp;*</Essential></InputTitle>
              <Input
                type="text"
                value={localId}
                onChange={(e) => setId(e.target.value)}
                required
              />
            <Button type="button" onClick={checkIdAvailability}>아이디 중복 체크</Button>
          </InputItemDiv>
        </InputFlex>

        <InputFlex>
          <InputItemDiv>
            <InputTitle>비밀번호<Essential>&nbsp;*</Essential></InputTitle>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </InputItemDiv>
          <InputItemDiv>
            <InputTitle>비밀번호 확인<Essential>&nbsp;*</Essential></InputTitle>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputItemDiv>
        </InputFlex>
        {/* 비밀번호 불일치 시 InfoMessage에서  ErrorMessage로 변경됨 */}
        {!confirmPasswordError && <InfoMessage>* 비밀번호는 6자 이상이여야합니다.</InfoMessage>}
        {confirmPasswordError && <ErrorMessage>* {confirmPasswordError}</ErrorMessage>}

        <InputFlex>
          <InputItemDiv>
            <InputTitle>이름<Essential>&nbsp;*</Essential></InputTitle>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputItemDiv>
          <InputItemDiv>
            <InputTitle>이메일<Essential>&nbsp;*</Essential></InputTitle>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </InputItemDiv>
        </InputFlex>

        <InputFlex>
        <InputItemDiv>
            <InputTitle>전화번호<Essential>&nbsp;*</Essential></InputTitle>
            <Input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneInput}
            />
            <Button type="button" onClick={requestVerificationCode}>인증 코드 요청</Button>
          </InputItemDiv>
        </InputFlex>
      

        <InputFlex>
          <InputItemDiv>
            <InputTitle>인증코드 확인<Essential>&nbsp;*</Essential></InputTitle>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button type="button" onClick={verifyCode}>인증 코드 확인</Button>
          </InputItemDiv>
        </InputFlex>
        
        <SubmitButton type="submit">회원가입</SubmitButton>

          {popupData && (
            <PopupForm
              message = {popupData.message}
              popupType = {popupData.popupType} 
              {...(popupData.integration && {
                onAccept: handleAcceptIntegration,
                onReject: handleRejectIntegration,
              })} // 통합 회원가입 처리 시에만 전달됨
              {...(!popupData.integration && {
                onClose: handleClosePopup,
              })}
            />
          )}
        <div id="recaptcha-container"></div>
      </Form>
    </FormContainer>
    
  );
};
const FormContainer = styled.div`
  font-family: 'Pretendard', sans-serif;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

const Form = styled.form`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Essential = styled.p`
  color: red;
`;
const InputItemDiv = styled.div`
  padding: 20px;
  width: 100%;
`;

const InputTitle = styled.h2`
  display: flex;
  font-size: 16px;
  width: 100%;
  margin-bottom: 10px;
`;
const Input = styled.input`
  all: unset; /* 기본 스타일 제거 */
  border-bottom: 1px solid #999; 
  box-sizing: border-box;
  padding: 15px 10px; 
  width: 450px;  
  font-size: 22px; 
  // margin: 0px 40px 15px 0px;

  &:focus {
    border-color: #222;
    outline: none;
  }
`;
const InputFlex = styled.div`
  display: flex;
  width: 100%;
`;

const Button = styled.button`
  //width: 100%;
  padding: 10px;
  //margin: 10px 0;
  margin-left: 20px;
  // border: 1px solid #5C3D2E;
  border-radius: 4px;
  background-color: #5C3D2E;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  margin: 40px auto;
  display: block;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #5C3D2E;
  padding: 20px 100px;
  color: #5C3D2E;
  justify-content: center;
  align-items: center;
   transform: translateX(-30%);
  &:hover {
    color: white;
    background-color: #5C3D2E;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 0;
  align-self: flex-start;
  padding-left: 20px;
`;

const InfoMessage = styled.p`
  color: #5C3D2E;
  font-size: 14px;
  margin: 0;
  align-self: flex-start;
  padding-left: 20px;
`;


export default SignupForm;
