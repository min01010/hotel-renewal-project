import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../redux/slices/userSlice';
import { createGlobalStyle } from 'styled-components';
import Navbar from "./Navbar";

const Header = () => {
    const dispatch = useDispatch();
    // Redux에서 사용자 정보를 가져오되, 초기 상태를 고려하여 안전하게 구조 분해 할당
    // const { user } = useSelector((state) => state.user); 
    // Redux에서 로그인한 사용자 정보 가져오기 //store->{ user }를 찾아->userReducer->reducer(state,action)가져옴
    const userState = useSelector((state) => state.user);
    const user = userState ? userState.user : null; 
    console.log('Current User:', user);

    const onLogout = () => {
      dispatch(logout()); // logout 함수를 호출
    };
  
    return (
      <>
        <HeaderContainer>
          <TopBar>
            <StyledLink to="/">
              <Logo>HOTEL</Logo>
            </StyledLink>
          </TopBar>
          <Navbar /> {/* 네비게이션 바 추가 */}
        </HeaderContainer>
        
      </>
    );
};

// 스타일 컴포넌트 정의
export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'NanumSquare'; 
  }

  // 글씨 굵기별로 골라 쓰기
  font-family: 'NanumSquareLight';
  font-family: 'NanumSquare';
  font-family: 'NanumSquareBold';
  font-family: 'NanumSquareExtraBold';
  font-family: 'NanumSquareAcb';
  font-family: 'NanumSquareAceb';
  font-family: 'NanumSquareAcl';
  font-family: 'NanumSquareAcr';

  * {
  margin: 0;
  padding: 0;
  bo
  box-sizing: border-box;
  .h2{
    display: flex;
  }
  }
`;

const HeaderContainer = styled.header`
  position: fixed; // 헤더를 고정 위치로 설정
  top: 0; // 화면 상단에 위치
  left: 0; // 화면 왼쪽에 위치
  width: 100%; // 전체 너비 사용
  z-index: 1000; // 다른 요소들보다 앞에 표시되도록 z-index 설정
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(55, 84, 114, 0.8); // 배경색에 투명도 추가
  color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

// TopBar 스타일 컴포넌트 수정 (배경색 투명하게)
const TopBar = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(248, 249, 250, 0.8); // 배경색에 투명도 추가
  border-bottom: 1px solid rgba(221, 221, 221, 0.5); // 테두리에도 투명도 추가
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 기본 밑줄 제거 */
  color: #000; /* 원하는 색상 */

    &:visited {
    color: #000; /* 방문한 후에도 동일한 색상 */
  }
    
  &:hover,
  &:focus,
  &:active {
    color: #000; /* hover, focus, active 상태에서도 같은 색상 유지 */
  }
`;

// const TopBar = styled.div`
//   width: 100%;
//   /* max-width: 1200px; /* 최대 너비 제한 */ */
//   margin: 0 auto; /* 중앙 정렬 */
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px 20px;
//   background-color: #f8f9fa;
//   border-bottom: 1px solid #ddd;
// `;

const Logo = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  flex-shrink: 0; /* 로고가 줄어들지 않게 고정 */
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: auto; /* AuthSection을 오른쪽 끝으로 밀어냄 */
`;
const WelcomeText = styled.span`
  font-size: 16px;
  color: #000; 
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #6c839f; /* 부드러운 파스텔 블루 */
  color: #fff; /* 흰색 글씨 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.5s, transform 0.4s;

  &:hover {
    background-color: #fff; /* 호버 시 색상 변화 */
    color: #6c839f;
  }
`;

const MainContent = styled.div`
  padding: 20px; /* 내용에 여백 추가 */
`;

export default Header;
