import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import DateRangePicker from "./DateRangePicker";
import RoomSelector from "./RoomSelector";

const ReservationBar = ({ isBarOpen, setIsBarOpen, searchData, setSearchData, isMainPage, isReservationClose, className, barHeight, dropdownHeight  }) => {
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [isOpen, setIsOpen] = useState(false);
  const [dates, setDates] = useState({
    startDate: today,
    endDate: tomorrow,
  });
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  
  useEffect(() => {
    if(isMainPage){
      setIsBarOpen(isOpen);
    }
  }, [isMainPage, isOpen, setIsBarOpen]);
  useEffect(() => {
    if (searchData) {
      setDates({
        startDate: new Date(searchData.startDate),
        endDate: new Date(searchData.endDate),
      });
      setRooms(searchData.rooms);
    }
  }, [searchData]);

  useEffect(() => {
    if (isReservationClose) {
      setIsOpen(false);
    }
  }, [isReservationClose]);

  const handleSearch = () => {
    const searchPayload = {
      startDate: dates.startDate.toLocaleDateString(),
      endDate: dates.endDate.toLocaleDateString(),
      rooms,
    };
    if (isMainPage) {
      navigate("/reservation", { state: searchPayload });
    } else {
      setSearchData(searchPayload);
    }
  };

  return (
    <Container className={className} $isHidden={isReservationClose}>
      <Bar $barHeight={barHeight} onClick={() => setIsOpen(!isOpen)}>
        <BarSpan1>
          <BarInfo>체크인 / 아웃</BarInfo>
          {dates.startDate && dates.endDate ? (
             <> 
              <CheckInOutDate>
                {`${formatDate(dates.startDate)} - ${formatDate(dates.endDate)}`}
              </CheckInOutDate>
              <DateCount>
                <strong>{Math.ceil((dates.endDate - dates.startDate) / (1000 * 60 * 60 * 24))}</strong>박
              </DateCount>
             </>
          ):("날짜 선택")}
        </BarSpan1>
        <BarSpan2>
          <RoomCount>객실<strong>{` ${rooms.length}`}</strong></RoomCount>
          <RoomCount>성인<strong>{` ${rooms.reduce((sum, room) => sum + room.adults, 0)}`}</strong></RoomCount>
          <RoomCount>어린이<strong>{` ${rooms.reduce((sum, room) => sum + room.children, 0)}`}</strong></RoomCount>
          {/* {`객실 ${rooms.length}개  성인 ${rooms.reduce((sum, room) => sum + room.adults, 0)}명  어린이 ${rooms.reduce((sum, room) => sum + room.children, 0)}명`} */}
        </BarSpan2>
        {/* <Searchbutton onClick={handleSearch}>검색</Searchbutton> */}
        <Searchbutton onClick={(e) => {
          e.stopPropagation(); // 상위 Bar 클릭 이벤트 방지
          if (isOpen) setIsOpen(false); // 열려 있으면 닫기
          handleSearch(); // 검색 실행
        }}>검색
        </Searchbutton>
      </Bar>
      {/* {isOpen && !isReservationClose && (
        <Dropdown  $dropdownHeight={dropdownHeight} $barHeight={barHeight}>

            <DateRangePicker selectedDates={dates} setSelectedDates={setDates} />

          <Divider/>
 
            <RoomSelector rooms={rooms} setRooms={setRooms} />

        </Dropdown>
      )} */}
      {!isReservationClose && (
      <Dropdown
        isOpen={isOpen} // 드롭다운 열릴지 여부
        $dropdownHeight={dropdownHeight}
        $barHeight={barHeight}
        $isMainPage={isMainPage}
      >
        <DateRangePicker selectedDates={dates} setSelectedDates={setDates} />
        <Divider />
        <RoomSelector rooms={rooms} setRooms={setRooms} />
      </Dropdown>
    )}
    </Container>
  );
};

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  position: relative;  
  box-shadow:
    0px 4px 6px rgba(0, 0, 0, 0.1),   // 아래 그림자
    0px -4px 6px rgba(0, 0, 0, 0.1);  // 위 그림자
`;

const Bar = styled.div`
  background: #fff;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;  // 세로 정렬을 중앙으로
`;
const BarInfo = styled.span`
  margin-right: 30px;
  color: #777;
`;
const CheckInOutDate = styled.span`
  font-weight: bold;
`;
const Dropdown = styled(({ isOpen, $isMainPage, ...rest }) => <div {...rest} />)`
  position: absolute;
  ${({ $isMainPage }) => $isMainPage ? `bottom: 100%;` : `top: 100%;`}
  width: 100%;
  background: white;
  box-shadow: ${({ $isMainPage }) => $isMainPage ? '0px -4px 6px rgba(0, 0, 0, 0.1)' : '0px 4px 6px rgba(0, 0, 0, 0.1)'};
  z-index: 10;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  max-height: ${({ isOpen }) => (isOpen ? '550px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  transition: max-height 0.4s ease, opacity 0.4s ease;
  overflow: hidden;
`;


const BarSpan1 = styled.div`
  padding-left: 20px;
  font-size: 20px;
  width: 60%;
  text-align: center;
  border-right: 1px solid #ccc;
`
const BarSpan2 = styled.div`
  font-size: 20px;
  width: 40%;
  text-align: center;
`
const RoomCount = styled.span`
  margin-right: 15px;
`
const DateCount = styled.span`
  padding-left: 20px;
  strong {
    font-weight: bold;
  }
`
const Searchbutton = styled.button`
  box-shadow:
    0px 4px 6px rgba(0, 0, 0, 0.1),   // 아래 그림자
    0px -4px 6px rgba(0, 0, 0, 0.1);  // 위 그림자
  width: 5%;
  height: 100%;
  padding: 0 35px;
  //background: rgba(47, 112, 199, 0.4);
  background: #5C3D2E;
  color: white;
  border: none;
`;

const Divider = styled.hr`
  width: 1px;
  height: 350px; /* 원하는 높이로 조정 */
  background-color: #ccc;
  border: none;
  display: inline-block;
`;
export default ReservationBar;