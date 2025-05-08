import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLeftDiv>
        <Link to="/">
          <Logo src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogo.svg?alt=media&token=ccec7e69-fc84-4f2b-a8ed-20a375e427a4" alt="Logo" />
        </Link>
        <InfoContainer>
          <InfoText>서울 강남구 테헤란로 606</InfoText>
          <InfoText>T. 02 2016 1234</InfoText>
        </InfoContainer>
        <InfoText> Copyright &copy; {new Date().getFullYear()} Hyatt Corporation Co. All rights reserved.</InfoText>
      </FooterLeftDiv>
      <FooterRightDiv>
        <div>
          <FooterButton><strong>예약</strong></FooterButton>
          <FooterButton>예약 확인</FooterButton>
        </div>
        <div>
          <FooterButton><strong>고객서비스</strong></FooterButton>
          <FooterButton>공지사항</FooterButton>
        </div>
        <div>
          <FooterButton><strong>기업사이트</strong></FooterButton>
          <FooterButton>소개</FooterButton>
          <FooterButton>인재 채용</FooterButton>
        </div>
        <div>
          <FooterButton><strong>고객센터</strong></FooterButton>
          <FooterButton>이용 약관</FooterButton>
          <FooterButton>개인정보 처리방침</FooterButton>
        </div>
      </FooterRightDiv>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  height: 100%; /* main에서 지정한 크기 꽉 채움 */
  background-color: #5E4D41;
  color: white;
  padding: 40px 350px;
  display: flex; /* flex로 변경 */
  flex-direction: row; /* 좌우 배치 */
  justify-content: space-between;
  font-family: 'Pretendard', sans-serif;
`;
const Logo = styled.img`
  max-width: 180px; /* 로고의 최대 너비 설정 */
  height: auto; /* 비율에 맞게 높이 자동 조정 */
  display: block; /* 이미지가 블록처럼 동작하도록 */
  flex-shrink: 0; /* 로고가 줄어들지 않게 고정 */
  object-fit: contain; /* 로고 비율을 유지하면서 크기를 맞춤 */
  margin-bottom: 30px;
`;
const InfoContainer = styled.div`
  text-align: left;
  flex-direction: column;
  font-size: 16px;
  padding: 15px 0px;
`;
const InfoText = styled.div`
  font-size: 14px;
  padding: 8px 0px;
`;
const FooterLeftDiv = styled.div`
  flex: 1; /* 왼쪽은 1 비율 */
  text-align: left;
`
const FooterRightDiv = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: left;
  font-size: 14px;
`;
const FooterButton = styled.div`
  padding: 15px;
  strong {
    font-weight: bold;
  }
  cursor: pointer;
`;

export default Footer;
