import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ReservationComplete = () => {
  return (
    <Container>
      <ReservationLevel>
        <Level>1</Level>
        <Level>2</Level><Divider/>
        <CurrentLevelDiv><Level $CurrentLevel>3</Level>예약 완료</CurrentLevelDiv>
      </ReservationLevel>
      <ReservcompleteWrapper>
        <ReservationCompleteImg src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Freservation_complete.svg?alt=media&token=e9e594ae-fd78-4a7a-8c41-fe0b8b627c58" alt="reservationCompleteImg"/>
        <ReservCompleteText>예약이 완료되었습니다.</ReservCompleteText>
        <ButtonDiv>
          <StyledLink to="/">
            <MainPageButton>메인 페이지로 이동하기</MainPageButton>
          </StyledLink>
          <StyledLink to="/mypage">
            <ReservationDetailButton>예약 내역 확인</ReservationDetailButton>
          </StyledLink>
        </ButtonDiv>
      </ReservcompleteWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 3% 15% 10% 15%;
  display: flex;
  flex-direction: column;   // 세로로 쌓기
  max-height: 600px;
`;
const ReservcompleteWrapper = styled.div`
  padding: 3% 0%;
  align-items: center;      // 각 요소를 가로 가운데 정렬
  justify-content: center;  // (선택) 수직 가운데 정렬
  text-align: center;      
`;

const ReservationLevel = styled.div`
  font-size: 26px;
  display: flex;
  align-items: center;
`;
const CurrentLevelDiv = styled.div`
  display: flex;
  align-items: center;
`;
const Level = styled.div`
  font-family: pretendard;
  font-size: 12px;
  padding: 6px 10px;
  color: ${({ $CurrentLevel }) => ($CurrentLevel ? 'white' : 'black')};
  background-color: ${({ $CurrentLevel }) => ($CurrentLevel ? '#5C3D2E' : 'white')};
  border: 1px solid #ccc;
  border-radius: 50%;
  margin-right: 4px;
`;
const ReservationCompleteImg = styled.img`
  width: 280px;
  height: 280px;
`;
const ReservCompleteText = styled.div`
  font-size: 36px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const ButtonDiv = styled.div`
  display: flex;
  margin-top: 50px;
  align-items: center;
  justify-content: center;
`;
const MainPageButton = styled.button`
  font-size: 20px;
  padding: 15px 25px;
  font-size: 18px;
  cursor: pointer;
  color: #82624D;
  background: white;
  border: 1px solid #82624D;
`;
const ReservationDetailButton = styled.button`
  font-size: 20px;
  padding: 15px 25px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  background: #82624D;
  border: 1px solid #82624D;
  margin-left: 15px;
`;
const Divider = styled.hr`
  width:30px;
  height: 1px; /* 원하는 높이로 조정 */
  background-color: #ccc;
  border: none;
  margin: 0px 15px;
`;

export default ReservationComplete;
