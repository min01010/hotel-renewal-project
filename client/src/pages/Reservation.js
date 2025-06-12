import React, { useState, useEffect } from "react";
import ReservationBar from "../components/Reservation/ReservationBar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PopupForm from "../components/Forms/PopupForm";
import styled from "styled-components";

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loginCheck = useSelector((state) => state.user.isLoggedIn);
  const [popupData, setPopupData] = useState(null); // 팝업 상태 관리

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const initialSearchData = location.state || { startDate: today, endDate: tomorrow, rooms: [{ adults: 1, children: 0 }] };  // 기본값 설정
  const [searchData, setSearchData] = useState(initialSearchData); // searchData 관리
  const start = new Date(searchData.startDate);
  const end = new Date(searchData.endDate);
  const timeDiff = end.getTime() - start.getTime();
  const nights = timeDiff / (1000 * 60 * 60 * 24); // 일수로 변환

  const [availableReservations, setAvailableReservations] = useState([]);

  useEffect(() => {
    if (searchData) {
      const fetchAvailableRooms = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3001/api/reserv/get-available-rooms",
            searchData
          );
          if (response.data.success) {
            setAvailableReservations(response.data.availableReservations);
          } else {
            console.log("예약 검색 실패:", response.data.message);
          }
        } catch (error) {
          console.error("예약 요청 실패:", error);
        }
      };
      fetchAvailableRooms();
    }
  }, [searchData]); // searchData가 변경될 때마다 호출


  // 예약하기 버튼 클릭 시 reservationdetail 페이지로 이동
  const handleReserveOption = (room) => {
    console.log("loginCheck?", loginCheck);
    if(loginCheck){
      // 서버와의 요구 사항과 데이터 처리 방식에 따라 다르지만, 
      // 일반적으로 ISO 형식 문자열을 사용하는 것이 더 표준적이고 안전한 방법
      const reservationData = {
        startDate: new Date(searchData.startDate).toISOString(), // ISO 형식으로 저장
        endDate: new Date(searchData.endDate).toISOString(),
        rooms: searchData.rooms,
        selectedRoom: room,
      };

      // navigate를 통해 옵션 선택 페이지로 데이터 전달
      navigate("/reservation-option", { state: reservationData });
    } else{
      setPopupData({
        popupType: 'info',
        message: '회원만 예약이 가능합니다. 로그인 후 이용해주세요.'
      });
    }
  }

  const handleClosePopup = () => {
    setPopupData(null); // 팝업 상태를 null로 설정하여 팝업을 닫음
  };


  return (
    <Container>
      <ReservationInfoDiv>
        <ReservationTitle>객실 예약</ReservationTitle>
        <ReservationLevel>
          <CurrentLevelDiv><Level $CurrentLevel>1</Level>객실 선택<Divider/></CurrentLevelDiv>
          <Level>2</Level>
          <Level>3</Level>
        </ReservationLevel>
      </ReservationInfoDiv>
      <ReservationBarStyled searchData={searchData} setSearchData={setSearchData} /> {/* ReservationBar에 searchData와 setSearchData 전달 */}
      <RoomInfoDiv>
        {availableReservations.length > 0 ? (
          availableReservations.map((room, index) => (
              <AvailableRoom key={index}>
                <RoomImageDiv>
                  <RoomImage src={room.image} alt={"RoomImage"}></RoomImage>
                </RoomImageDiv>
                <RoomInfo>
                  <RoomInfoLeft>
                    <AvailableRoomType>{room.room_type}</AvailableRoomType>
                    <RoomCapacity>최대 수용 인원: {room.capacity}명</RoomCapacity>
                    <RoomDetail to={`/rooms/${room.room_id}`}>객실 상세보기</RoomDetail>
                  </RoomInfoLeft>
                  <RoomInfoRight>
                    <Nights>{nights}박</Nights>
                    <RoomPrice>가격 {(room.price * 1.1 * nights ).toLocaleString()}  원</RoomPrice>
                    <AdditionalTax>부가세 포함</AdditionalTax>
                    <ReservationButton onClick={() => handleReserveOption(room)}>예약하기</ReservationButton>
                  </RoomInfoRight>
                </RoomInfo>
              </AvailableRoom>
          ))
        ) : (
            <NoAvailableRooms>예약 가능한 객실이 없습니다.</NoAvailableRooms>
        )}
      </RoomInfoDiv>
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

const Container = styled.div`
  align-items: center;
  margin: 3% 15% 10% 15%;
  justify-content: center;
`;
const ReservationInfoDiv = styled.div`
  align-items: center;
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
const Divider = styled.hr`
  width:30px;
  height: 1px; /* 원하는 높이로 조정 */
  background-color: #ccc;
  border: none;
  margin: 0px 15px;
`;
const ReservationBarStyled = styled(ReservationBar)`
  margin: 0px 80px; 
  z-index: 10; /* 예약바를 앞으로 가져옴 */
  transition: top 0.3s ease; /* 부드럽게 애니메이션 효과 추가 */
  text-align: center;
  
  /* CSS에서 barHeight와 dropdownHeight 설정 */
  & > div:first-child {
    height: 80px; /* barHeight */
  }

  & > div:nth-child(2) {
    height: auto; /* dropdownHeight */
  }
`;
const RoomInfoDiv = styled.div`
  text-align: center;
  margin-top: 50px;
  align-items: center;
  min-height: 500px;
`;
const NoAvailableRooms = styled.div`
  padding-top: 80px;
  text-align: center;
  font-size: 20px;
  align-items: center;
`;
const AvailableRoom = styled.div`
  width: 85%;
  height: auto;
  border: 1px solid #ccc;
  margin: 40px auto;
  display: flex;
`;
const RoomImageDiv = styled.div`
  width: 40%;
  height: auto;
`;
const RoomImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const RoomInfo = styled.div`
  width: 60%;
  padding: 50px 60px;
  display: flex;
`
const RoomInfoLeft = styled.div`
  flex: 1;
  text-align: left;
  font-size: 20px;
  display: flex;
  flex-direction: column;
`
const AvailableRoomType = styled.p`
  font-size: 33px;
  padding-bottom: 60px;
  `
const RoomCapacity = styled.div`
  margin-top: auto;
  font-size: 15px;
  color: #333;
`;
const RoomDetail = styled(Link)`
  margin-top: auto;
  font-size: 18px;
  color: #5C3D2E;
  text-decoration: underline;

  &:visited,
  &:hover,
  &:focus,
  &:active {
    color: #5C3D2E; /* hover, focus, active 상태에서도 같은 색상 유지 */
  }
`
const RoomInfoRight = styled.div`
  flex: 1;
  align-items: flex-end;
  font-size: 20px;
  display: flex;
  flex-direction: column;
`
const Nights = styled.div`
  font-size: 15px;
  padding-bottom: 8px;
`;
const RoomPrice = styled.div`
  padding-bottom: 5px;
`;
const AdditionalTax = styled.div`
  font-size: 15px;
`;
const ReservationButton = styled.button`
  margin-top: auto; /* 부모 사이즈의 맨 밑에 붙음 */
  padding: 5px 8px;
  background-color: #977B64;
  border-radius: 5%;
  color: white;
  width: 100px;
`;
export default Reservation;
