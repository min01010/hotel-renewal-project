import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import LoginForm from "../components/Forms/LoginForm";
import { useSelector } from "react-redux";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginCheck = useSelector((state) => state.user.isLoggedIn);

  const handleLogin = async (localId, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        { localId, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { user, accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        dispatch(
          login({
            id: user.id,
            user_name: user.user_name,
            method: "local",
          })
        );
        navigate("/");
        console.log("loginCheck?",loginCheck);
      } else {
        setError(response.data.message || "아이디 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // ✅ CSRF 공격 방지를 위한 state 값 생성
  const generateState = () => {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem("state", state);
    return state;
  };

  // ✅ 카카오 SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("49e7df958f97f8079a2f496233f6b34e"); // 카카오 JavaScript 키
      console.log("Kakao SDK initialized");
    }
  }, []);

  // ✅ 카카오 로그인 버튼 클릭 시 실행
  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      setError("카카오 SDK가 로드되지 않았습니다.");
      return;
    }

    const storedState = generateState();

    await axios.post("http://localhost:3001/api/users/set-auth-state", { storedState }, { withCredentials: true });

    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:3000/kakao-callback",
      state: storedState,
    });
  };

  // ✅ 네이버 로그인 버튼 클릭 시 실행
  const handleNaverLogin = async () => {
    const storedState = generateState();

    const response = await axios.post("http://localhost:3001/api/users/set-auth-state", { storedState }, { withCredentials: true });

    if (response) {
      const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=9OCIuWKT3jDebHpNIKKN&response_type=code&redirect_uri=http://localhost:3000/naver-callback&state=${storedState}`;
      window.location.href = naverLoginUrl;
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>로그인</Title>
        <LoginWrapperDiv>
          <LoginForm onSubmit={handleLogin} error={error} />
          <StyledLink to="/signup">
            <SignupButton type="button">회원가입</SignupButton>
          </StyledLink>
          <SocialLoginTitle>소셜 로그인</SocialLoginTitle>
          <KakaoButton type="button" onClick={handleKakaoLogin}>
            <IconImg src={"https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogin_logo_kakaotalk.svg?alt=media&token=d3b67996-538c-4429-a6fe-c2b890866281"} alt={"카카오톡 로고"}/>
            <span>카카오 로그인</span>
          </KakaoButton>
          <NaverButton type="button" onClick={handleNaverLogin}>
            <IconImg src={"https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogin_logo_naver.svg?alt=media&token=c3752b41-c36a-4dd7-ab29-63b80c5c29ab"} alt={"네이버 로고"}/>
            <span>네이버 로그인</span>
          </NaverButton>
        </LoginWrapperDiv>
        <Footer/>
      </LoginBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 3% 32%;
`;

const LoginBox = styled.div`
  background-color: white;
  width: 100%;
  padding: 50px 70px;
`;

const LoginWrapperDiv = styled.div`
  font-family: pretendard;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 50px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 40px;
`;
const SocialLoginTitle = styled.p`
  margin-top: 30px;
  font-size: 25px;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const IconImg = styled.img`
  margin-right: 10px;
`
const KakaoButton = styled.button`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 12px;
  background-color: #FEE500;
  color: #3C1E1E;
  font-size: 20px;
  text-align: center;
  aligin-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
  }

`;

const NaverButton = styled.button`
  display: flex;
  width: 100%;
  height: 60px;
  padding: 12px;
  background-color: #03C75A;
  color: white;
  font-size: 20px;
  text-align: center;
  aligin-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: none;

  span {
    display: flex;
    align-items: center;
  }
`;

const SignupButton = styled.button`
  width: 100%;
  height: 60px;
  padding: 12px;
  background-color: white;
  color: #5C3D2E;
  font-size: 20px;
  text-align: center;
  box-sizing: border-box;
  border: 1px solid #5C3D2E;
`;


export default Login;
