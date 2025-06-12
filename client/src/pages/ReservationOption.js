import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TermsForm from "../components/Forms/TermsForm";
import PaymentButton from "../components/Forms/PaymentButton";
import useFetchWithToken from "../hooks/useFetchWithToken";
import styled from "styled-components";

const ReservationOption = () => {
  const { fetchWithToken } = useFetchWithToken();  // 훅을 호출하여 fetchWithToken 가져오기

  // useLocation으로 예약 정보 받기
  const location = useLocation();
  const { startDate, endDate, rooms, selectedRoom } = location.state || {};

  const navigate = useNavigate();
  const userState = useSelector((state) => state.user.userInfo);
  const user = userState ? userState : null; 
  
  const [popupData, setPopupData] = useState(null); // 팝업 상태 관리
  const [userData, setUserData] = useState({});
  
  // 약관 동의 상태
  const [termsAgreement, setTermsAgreement] = useState({});
  const [mandatoryTerms, setMandatoryTerms] = useState([]);

  // 날짜 차이 계산 (박수 계산)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nightCount = (end - start) / (1000 * 60 * 60 * 24); // 밀리초를 일수로 변환

  // 각 객실 가격 계산
  const roomPrices = rooms.map((room) => ({
    ...room,
    totalPricePerRoom: selectedRoom.price * nightCount, // 1박당 가격 * 숙박 일수
  }));

  // 총 객실 금액 계산
  const totalRoomPrice = roomPrices.reduce((acc, room) => acc + room.totalPricePerRoom, 0);

  // 세금 (총 객실 금액의 10%)
  const tax = totalRoomPrice * 0.1;

  // 최종 결제 금액
  const finalPrice = totalRoomPrice + tax;

  const handleTermsChange = (mandatoryList, selectedList) => {
    setMandatoryTerms(mandatoryList); // 필수 약관 목록 저장
    setTermsAgreement(selectedList); // 체크한 약관 목록 저장
  };

  // 예약 확인 팝업 열기
  const handlePopupOpen = () => {
    setPopupData({
      popupType: 'info',
      message: '해당 객실을 예약하시겠습니까?',
      reservation: true
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;
      try {
        const response = await fetchWithToken(`http://localhost:3001/api/users/get-reserv-user-info?user_unique_id=${user.id}`);
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };
    fetchUserInfo();
  }, [user]);

  // 예약 확인 버튼 클릭 시 서버로 예약 정보 전송
  const handleReservationConfirm = async(paymentData) => {
    // 모든 필수 약관이 동의되었는지 확인
    const isRequiredTermsAgreed = mandatoryTerms.every((id) => termsAgreement[id] === true);

    if (!isRequiredTermsAgreed) {
      setPopupData({
        popupType: 'error',
        message: '필수 약관에 동의해야 예약이 가능합니다.'
      });
      return;
    }
    // 예약 정보 준비
    const reservationData = {
      user_unique_id: user.id,
      room_id: selectedRoom.room_id,
      rooms: rooms, // 객실 배열 전체를 서버로 전송
      check_in_date: startDate,
      check_out_date: endDate,
      total_price: finalPrice,
      termsAgreement: termsAgreement, // 약관 동의 데이터 포함
      imp_uid: paymentData.imp_uid,
      merchant_uid: paymentData.merchant_uid,
      pay_method: paymentData.pay_method,
      pg_provider: paymentData.pg_provider,
      pg_tid: paymentData.pg_tid,
    };

    // fetchWithToken 이용해 서버에 예약 정보 전송
    try {
      const response = await fetchWithToken("http://localhost:3001/api/reserv/create-user-reservation", { method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservations: reservationData }),
      })
      console.log("예약 성공", response);
      navigate("/reservation-complete");
    } catch (error) {
      console.error("예약 실패", error);
    }
  };

  return (
    <Container>
      <ReservationTitle>객실 예약</ReservationTitle>
      <ReservationLevel>
        <Level>1</Level>
        <CurrentLevelDiv><Level $CurrentLevel>2</Level>예약 옵션 선택<Divider/></CurrentLevelDiv>
        <Level>3</Level>
      </ReservationLevel>
      <ReservationOptionDiv>
        <RoomInfoDiv>
          <RoomInfo>
            <InfoRoomtype>{selectedRoom ? selectedRoom.room_type : "정보 없음"}</InfoRoomtype>
            {rooms.map((room, index) => (
              <div key={index}>
                <InfoText>객실 {index + 1} {`성인 ${room.adults} 어린이 ${room.children}`}</InfoText>
              </div>
            ))}
          </RoomInfo>
          <UserInfoDiv>
            <InfoTitle>예약 고객 정보</InfoTitle>
            <InfoGrid>
              <Label>이름</Label>
              <Value>{userData.name || "불러오는 중..."}</Value>

              <Label>이메일</Label>
              <Value>{userData.email || "불러오는 중..."}</Value>

              <Label>연락처</Label>
              <Value>{userData.phone || "불러오는 중..."}</Value>
            </InfoGrid>
          </UserInfoDiv>

          <AdditionalRequestDiv>
            <InfoTitle>추가 요청사항</InfoTitle>
            <TextArea placeholder="추가 요청사항을 입력해주세요." />
          </AdditionalRequestDiv>

          <TermsDiv>
            <InfoTitle>객실 예약 약관</InfoTitle>
            <TermsForm onTermsChange={handleTermsChange} />
          </TermsDiv>
        </RoomInfoDiv>  
        <DatePriceInfoDiv>
          <ReservationInfoTitle>예약 정보</ReservationInfoTitle>
          <ReservationInfoAmount>객실 요금</ReservationInfoAmount>
          <PriceInfo>
            {/* 객실별 정보 표시 */}
            {roomPrices.map((room, index) => (
              <RoomDetails key={index}>
                <RoomInfoText>객실 {index + 1}</RoomInfoText>
                <PriceDiv>
                  <DateInfoText>
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </DateInfoText>
                  <RoomPriceInfoText>KRW {room.totalPricePerRoom.toLocaleString()}</RoomPriceInfoText>
                </PriceDiv>
                <RoomPriceDivider/>
              </RoomDetails>
            ))}

            {/* 총 금액 & 세금 */}
            <PriceRow>
              <PriceInfoText>합계</PriceInfoText>
              <PriceInfoText>{totalRoomPrice.toLocaleString()} 원</PriceInfoText>
            </PriceRow>
            <RoomPriceDivider/>
            <PriceRow>
              <PriceInfoText>세금 (10%)</PriceInfoText>
              <PriceInfoText>{tax.toLocaleString()} 원</PriceInfoText>
            </PriceRow>

            <FinalPriceRow>
              <PriceInfoText>총 금액</PriceInfoText>
              <PriceInfoText>{finalPrice.toLocaleString()} 원</PriceInfoText>
            </FinalPriceRow>
          </PriceInfo>
          <RegulationDiv>
            <RegulationTitle>* 취소 및 환불 규정</RegulationTitle>
            <RegulationText>
              숙박예정일 1일전 18시까지는 위약금 없이 취소 가능<br/>
              위 기간 이후 취소 또는 변경 시 (No Show 포함)<br/>
              - 성수기 (4, 5, 6, 10, 11월, 12월 24일, 12월 31일) : 최초 1박 요금의 80% 부과<br/>
              - 비수기 (성수기 외 기간) : 최초 1박 요금의 10% 부과
            </RegulationText>
          </RegulationDiv>
          <PaymentButton name={userData.name} phone={userData.phone} email={userData.email} price={finalPrice} onSuccess={handleReservationConfirm}/>
        </DatePriceInfoDiv>
      </ReservationOptionDiv>
    </Container>
  );
};

// 스타일 정의
const Container = styled.div`
  padding: 3% 15% 10% 15%;
`;

const ReservationOptionDiv = styled.div`
  display: flex;
  margin: 50px 60px;
  justify-content: space-between;
`;
const RoomInfoDiv = styled.div`
  flex: 1.6;
  display: flex;
  //width: 50%;
  flex-direction: column;
`;
const RoomInfo = styled.div`
  margin-bottom: 30px;
`;

const ReservationTitle = styled.div`
  font-size: 40px;
  margin-bottom: 30px;
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
const RoomPriceDivider = styled.hr`
  height: 1px; /* 원하는 높이로 조정 */
  background-color: #ccc;
  border: none;
`;
const InfoRoomtype = styled.div`
  font-size: 36px;
`;

const InfoTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 22px;
`;

const InfoText = styled.p`
  font-size: 20px;
  margin: 5px 0px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;  // label 넓이 고정, value는 유동
  row-gap: 10px;
  column-gap: 20px;
`;

const Label = styled.div`
  font-size: 20px;
  // font-weight: bold;
`;

const Value = styled.div`
  font-size: 20px;
`;

const AdditionalRequestDiv = styled.div`
  margin-bottom: 25px;
  width: 70%;
`;
const TermsDiv = styled.div`
`;


const DatePriceInfoDiv = styled.div`
  border: 1px solid #333;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 50px;
`;

const ReservationInfoTitle = styled.div`
  font-size: 30px;
  margin-bottom: 4px;
`;
const RoomInfoText = styled.div`
  font-size: 22px;
  margin-top: 20px;
`;
const DateInfoText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;
const PriceDiv = styled.div`
  justify-content: space-between;
  display: flex;
`;
const ReservationInfoAmount = styled.div`
  font-size: 18px;
`;
const PriceInfo = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;
const RoomPriceInfoText = styled.div`
  font-size: 18px;
`;
const PriceInfoText = styled.div`
  font-size: 20px;
  padding: 10px 0px;
`;
const Divider = styled.hr`
  width:30px;
  height: 1px; /* 원하는 높이로 조정 */
  background-color: #ccc;
  border: none;
  margin: 0px 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
  font-size: 18px;
`;

const UserInfoDiv = styled.div`
  margin-bottom: 40px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const FinalPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 22px;
  padding-top: 10px;
  border-top: 2px solid #000;
`;

const RoomDetails = styled.div`
  margin-bottom: 10px;
`;
const RegulationDiv = styled.div`
  margin: 35px 0px;
  color: #777;
`;
const RegulationTitle = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;
const RegulationText = styled.div`
  font-size: 14px;
`;



export default ReservationOption;
