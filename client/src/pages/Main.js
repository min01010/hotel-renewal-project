import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReservationBar from "../components/Reservation/ReservationBar";
import NaverMap from "../components/NaverMap"; // 지도 컴포넌트
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useActiveSection from "../hooks/useActiveSection"; // 커스텀 훅 import
import Footer from "../components/_layout/Footer";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux"; // Redux에서 값 가져오기

const Main = () => {
  const [mainImages, setMainImages] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // 이미지 로드 상태 관리
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReservationClose, setIsReservationClose] = useState(false); // 예약 바 상태 추가
  const [footerVisible, setFooterVisible] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [isBarOpen, setIsBarOpen] = useState(false);
  // 섹션 refs
  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    // useRef(null)
  ];
  
  // 현재 활성화된 섹션 추적
  // const activeSection = useActiveSection(sectionRefs);

  // 현재 활성화된 섹션 추적 (Redux에서 직접 가져오기)
  const activeSection = useSelector((state) => state.activeSection.activeSection);
  // 커스텀 훅 실행 (Redux 상태 업데이트 역할만 함)
  useActiveSection(sectionRefs);

  useEffect(() => {
    if (activeSection === 5) {
      setFooterVisible(true);  // 섹션 6에 도달하면 footer 보이기
    } else {
      setFooterVisible(false); // 다른 섹션에서는 footer 숨기기
    }
  }, [activeSection]);

  useEffect(() => {
    //호텔 이미지만 불러옴
    const fetchMainImages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/main/get-main-images");
        setMainImages(response.data.images);
        // setIsImageLoaded(true); // 이미지 로드 완료 후 상태 업데이트
      } catch (error) {
        console.error("메인 이미지 가져오기 실패:", error);
      }
    };
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rooms/get-all-rooms");
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("객실 목록 가져오기 실패:", error);
      }
    };
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rooms/get-all-facilities");
        setFacilities(response.data.facilities);
      } catch (error) {
        console.error("부가시설 목록 가져오기 실패:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/events/get-all-events?limit=3");
        setEvents(response.data.events);
      } catch (error) {
        console.error("이벤트 목록 가져오기 실패:", error);
      }
    };

    fetchMainImages();
    fetchRooms();
    fetchFacilities();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && selectedRoomId === null) {
      setSelectedRoomId(rooms[0].room_id);
    }
  }, [rooms, selectedRoomId ]);

  useEffect(() => {
    // 예약 바 상태 관리
    if (activeSection === 0) {
      setIsReservationClose(false);
    } else {
      setIsReservationClose(true);
    }
  }, [activeSection]);

  const selectedRoom = rooms.find((room) => room.room_id === selectedRoomId);

  const prevFacility = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? facilities.length - 1 : prevIndex - 1));
  };

  const nextFacility = () => {
    setSelectedIndex((prevIndex) => (prevIndex === facilities.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <MainContainer>
      <Section
        ref={sectionRefs[0]}
        $isActive={activeSection === 0}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeSection === 0 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <MainArea $mainImageUrl={mainImages.find(image => image.entity_id === 1)?.image_url}>
          {mainImages.find(image => image.entity_id === 1) ? (
            <HotelMainImage
              src={mainImages.find(image => image.entity_id === 1).image_url}
              alt="Hotel Image"
              onLoad={() => setIsImageLoaded(true)} // 이미지 로드 완료시 상태 변경
            />
          ) : (
            <p>이미지가 없습니다.</p>
          )}
            {isImageLoaded && ( // 이미지 로드 완료 후 예약바만 렌더링
              <>
                <MainLogoLuxuryHotel src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Fmain_logo_luxuryHotel.svg?alt=media&token=735acac7-f336-4b90-9ebf-80c8b86bf3e7" alt="mainLogoLuxuryhotel"></MainLogoLuxuryHotel>
                <MainLogoParkHyattHotel src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Fmain_logo_ParkHyattSEOUL.svg?alt=media&token=170662dc-f813-4cde-ac1d-4bf2965f6c08" alt="mainLogoParkHyattHotel"></MainLogoParkHyattHotel>
                <ReservationBarStyled 
                  isMainPage={true} 
                  isReservationClose={isReservationClose} 
                  setIsReservationClose={setIsReservationClose}
                  isBarOpen={isBarOpen} // isOpen 상태 전달
                  setIsBarOpen={setIsBarOpen}
                />
              </>
            )}
        </MainArea>
      </Section>

      <Section 
        ref={sectionRefs[1]} 
        $isActive={activeSection === 1}
        initial={{ opacity: 0}}
        animate={{ opacity: activeSection === 1 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <HotelInfo>
          <InfoWrapper>
            <HotelInfoTitle>
              서울 강남에 위치한<br />
              최고급 럭셔리 호텔
            </HotelInfoTitle>
            <HotelInfoContent>
            서울의 비즈니스와 쇼핑의 중심지 강남에 위치하여, 무역센터와 코엑스(COEX)<br/>
            맞은편에 자리하고 있습니다. 최고 수준의 레스토랑에서 제공하는 다양한 다이닝<br/>
            옵션부터 편안한 시간을 위한 스파 서비스까지, 고객님의 안락한 휴식과 성공적인<br/>
            비즈니스를 위해 기대를 뛰어넘는 최상의 프라이빗 서비스를 약속 드립니다.
            </HotelInfoContent>
          </InfoWrapper>
          <HotelImagesWrapper>
          {mainImages
            .filter(image => image.entity_id !== 1)
            .map((image,index) => (
              <HotelImageWrapper key={image.image_id}>
                <HotelImage
                  src={image.image_url}
                  alt={`Hotel Image ${image.image_id}`}
                  $isPool={index === 1}
                 
                />
                <ImageLabel>{index === 0 ? "로비" : "수영장"}</ImageLabel>
              </HotelImageWrapper>
          ))}
          </HotelImagesWrapper>
        </HotelInfo>
      </Section>

      <Section 
        ref={sectionRefs[2]} 
        $isActive={activeSection === 2}
        initial={{ opacity: 0}}
        animate={{ opacity: activeSection === 2 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: "#F9F8F6" }}
      >
        <RoomInfo>
          <RoomInfoTitle>객실 및 스위트룸</RoomInfoTitle>
          <RoomDiv>
            <RoomType>
              {rooms.map((room) => (
                <RoomItem
                  key={room.room_id}
                  onClick={() => setSelectedRoomId(room.room_id)}
                  $isSelected={selectedRoomId === room.room_id}
                >
                  {room.room_type}

                </RoomItem>
              ))}
            </RoomType>

            {/* 선택된 객실에 대한 이미지 */}
            <SelectedRoom>
              <RoomImagesContainer>
              {selectedRoom?.Images && selectedRoom.Images.length > 0 ? (
                <RoomImage
                  key={selectedRoom.Images[0].entity_id}
                  src={selectedRoom.Images[0].image_url}
                  alt={selectedRoom.title}
                />
              ) : (
                <p>이미지가 없습니다.</p>
              )}
            </RoomImagesContainer>

              {/* 선택된 객실에 대한 제목 */}
              <RoomContent>
                {selectedRoom && selectedRoom.title}
              </RoomContent>
            </SelectedRoom>
            
          </RoomDiv>
          
        </RoomInfo>
      </Section>

      <Section 
        ref={sectionRefs[3]} 
        $isActive={activeSection === 3}
        initial={{ opacity: 0 }}
        animate={{ opacity: activeSection === 3 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: "#82624D" }}
      >
        <FacilityInfo>
          <FacilityTitle>부가시설</FacilityTitle>
          <CarouselContainer>
            <FacilityWrapper>
              {facilities.length > 0 && (
                <>
                  {/* 이전 시설 */}
                  <FacilityItem $isFaded>
                    {facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1]?.Images?.[0]?.image_url ? (
                      <FacilityLink
                        as={Link} // Link 컴포넌트처럼 동작하도록 변경
                        to={`/facilities/${facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1]?.facility_id}`}>
                        <FacilityImage
                          src={facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1].Images[0].image_url}
                          alt={facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1].title}
                        />
                      </FacilityLink>
                    ) : (
                      <p>이미지가 없습니다.</p>
                    )}
                    <FacilityText>
                    <FacilityTextTitle>{facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1]?.facility_type}</FacilityTextTitle>
                    <FacilityTextContent>{facilities[selectedIndex === 0 ? facilities.length - 1 : selectedIndex - 1]?.title}</FacilityTextContent>
                    </FacilityText>
                  </FacilityItem>
                  <FacilityButtonWrapper>
                  <FacilityLeftButton src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Fmain_leftButton.svg?alt=media&token=925d5135-11c8-47b6-8b52-f588138d16c9" alt="mainRightButton" onClick={prevFacility}></FacilityLeftButton>
                  </FacilityButtonWrapper>
                  {/* 선택된 시설 */}
                  <FacilityItem $isSelected>
                    {facilities[selectedIndex]?.Images?.[0]?.image_url ? (
                      <FacilityLink
                        as={Link} // Link 컴포넌트처럼 동작하도록 변경
                        to={`/facilities/${facilities[selectedIndex]?.facility_id}`}>
                          <FacilityImage
                            src={facilities[selectedIndex].Images[0].image_url}
                            alt={facilities[selectedIndex].title}
                          />
                      </FacilityLink>
                    ) : (
                      <p>이미지가 없습니다.</p>
                    )}
                    <FacilityText>
                    <FacilityTextTitle>{facilities[selectedIndex]?.facility_type}</FacilityTextTitle>
                    <FacilityTextContent>{facilities[selectedIndex]?.title}</FacilityTextContent>
                    </FacilityText>
                  </FacilityItem>
                  <FacilityButtonWrapper>
                  <FacilityRightButton src="https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Fmain_rightButton.svg?alt=media&token=efde5d2f-4b0b-4c7c-b5a7-d9399f0f285c" alt="mainRightButton" onClick={nextFacility}></FacilityRightButton>
                  </FacilityButtonWrapper>
                  {/* 다음 시설 */}
                  <FacilityItem $isFaded>
                    
                    {facilities[(selectedIndex + 1) % facilities.length]?.Images?.[0]?.image_url ? (
                      <FacilityLink
                      as={Link} // Link 컴포넌트처럼 동작하도록 변경
                      to={`/facilities/${facilities[(selectedIndex + 1) % facilities.length]?.facility_id}`}>
                        <FacilityImage
                          src={facilities[(selectedIndex + 1) % facilities.length].Images[0].image_url}
                          alt={facilities[(selectedIndex + 1) % facilities.length].title}
                        />
                      </FacilityLink>
                    ) : (
                      <p>이미지가 없습니다.</p>
                    )}
                    <FacilityText>
                    <FacilityTextTitle>{facilities[(selectedIndex + 1) % facilities.length]?.facility_type}</FacilityTextTitle>
                    <FacilityTextContent>{facilities[(selectedIndex + 1) % facilities.length]?.title}</FacilityTextContent>
                    </FacilityText>
                  </FacilityItem>
                </>
              )}
            </FacilityWrapper>
          </CarouselContainer>
        </FacilityInfo>
      </Section>

      <Section         
        ref={sectionRefs[4]} 
        $isActive={activeSection === 4}
        initial={{ opacity: 0}}
        animate={{ opacity: activeSection === 4 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}>
        <EventInfo>
          <EventTitle>이벤트</EventTitle>
          <Link to="/event-list">
            <EventViewMoreButton>VIEW MORE<StyledChevronRightViewMore size={28} strokeWidth={1} /></EventViewMoreButton>
          </Link>
          <EventWrapper>
            {events.map((event) => (
              <EventItem
                as={Link} // Link 컴포넌트처럼 동작하도록 변경
                to={`/events/${event.event_id}`}
                key={event.event_id}
                onMouseEnter={() => setHoveredEvent(event.event_id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <EventImageWrapper>
                  <EventImage
                    src={event.Images[0]?.image_url}
                    alt={event.title}
                  />
                  <EventTypeWrapper $isHovered={hoveredEvent === event.event_id}>
                    <EventType>{event.event_name} </EventType><StyledChevronRight strokeWidth={1} />
                  </EventTypeWrapper>
                </EventImageWrapper>
                <EventDetails $isHovered={hoveredEvent === event.event_id}>
                  <EventTextTitle>{event.event_name}</EventTextTitle>
                  <EventPeriod>{event.period}</EventPeriod>
                </EventDetails>
              </EventItem>
            ))}
          </EventWrapper>
        </EventInfo>
      </Section>

      <Section 
        ref={sectionRefs[5]} 
        $isActive={activeSection === 5}
        initial={{ opacity: 0}}
        animate={{ opacity: activeSection === 5 ? 1 : 0.5 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: "#F9F8F6" }}
      >
        <LocationInfo>
          <LocationTitle>오시는 길</LocationTitle>
          <Location>
            <MapContainer>
              {/* <NaverMap/> */}
            </MapContainer>
            <InfoContainer>
              <p>서울 강남구 테헤란로 606, 서울, 대한민국, 06174</p>
              <HighlightText>삼성역 2번 출구에서 15m</HighlightText>
              <Divider />
              <p>전화번호: +82 2 2016 1234</p>
              <p>팩스: +82 2 2016 1200</p>
              <Divider />
              <p>체크인: 15:00</p>
              <p>체크아웃: 11:00</p>
            </InfoContainer>
          </Location>
        </LocationInfo>
      </Section>
      <FooterContainer $isVisible={footerVisible}>
        <Footer />
      </FooterContainer>
      {/* <Section 
        ref={sectionRefs[6]} 
        $isActive={activeSection === 6}
        initial={{ opacity: 0}}
        // animate={{ opacity: footerVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        $isHalf={true} // 이 섹션만 50% 적용
      >
      </Section> 
        <StyledFooterContainer>
          <Footer />
        </StyledFooterContainer>*/}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow-x: hidden;
`;
const MainLogoLuxuryHotel = styled.img`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-42%);
  max-width: 200px; /* 로고의 최대 너비 설정 */
  height: auto; /* 비율에 맞게 높이 자동 조정 */
  z-index: 9;
`;
const MainLogoParkHyattHotel = styled.img`
  position: absolute;
  top: 42.5%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 470px; /* 로고의 최대 너비 설정 */
  height: auto; /* 비율에 맞게 높이 자동 조정 */
  z-index: 10;
`;
const Section = styled(motion.div)`
  height: ${({ $isHalf }) => ($isHalf ? "40vh" : "100vh")}; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  scroll-snap-align: start;
  opacity: ${({ $isHalf }) => ($isHalf ? 0.5 : 1)}; /* 섹션이 반으로 줄어들 때 opacity 조정 */
`;

const MainArea = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
  background-color: #f5f5f5;
  overflow: hidden;
  background-image: ${({ $mainImageUrl }) => $mainImageUrl ? `url(${$mainImageUrl})` : "none"};
  background-size: cover; 
  background-position: center;

   &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3); /* 불투명 오버레이 (여기서 투명도 조절) */
    z-index: 1;
  }
`;

const ReservationBarStyled = styled(ReservationBar)`
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  z-index: 10; /* 예약바를 앞으로 가져옴 */
  transition: top 0.3s ease; /* 부드럽게 애니메이션 효과 추가 */
  
  /* CSS에서 barHeight와 dropdownHeight 설정 */
  & > div:first-child {
    height: 80px; /* barHeight */
  }

  & > div:nth-child(2) {
    height: auto; /* dropdownHeight */
  }
`;

const HotelInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 54%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center;
  width: 100%;
  gap: 40px;
`;

const HotelInfoTitle = styled.div`
  flex: 0 0 auto; /* flex-grow, flex-shrink, flex-basis 모두 조정 */
  width: 40%; /* 너비를 40%로 제한 */
  text-align: left;
  font-size: 36px;
`;
const HotelInfoContent = styled.div`
  flex: 1; /* 나머지 공간을 차지 */
  text-align: left;
  font-size: 16px;
  line-height: 1.5;
`;

const HotelImagesWrapper = styled.div`
  margin-top: 30px; /* 위 요소와 간격 */
  display: flex;
  justify-content: space-between;
  
`;

const HotelImageWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 이미지와 텍스트를 세로 정렬 */
`;

const HotelImage = styled.img`
  width: ${({ $isPool }) => ($isPool ? "420px" : "529px")};
  max-width: 100%;
  height: 390px; /* 고정 높이 설정 */
  object-fit: cover; /* 크기 조절 시 비율 유지 */
`;

const ImageLabel = styled.span`
  margin-top: 10px; /* 이미지와 텍스트 간격 */
  font-size: 20px;
  text-align: left;
`;
const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #F9F8F6;
  max-width: 54%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
`;
const RoomInfoTitle = styled.div`
  text-align: left;
  font-size: 36px;
  margin-bottom: 60px;
`;
const RoomDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const RoomType = styled.div`
  font-size: 24px;
`;
const RoomItem = styled.div`
  width: 100%;
  text-align: left;
  padding-bottom: 35px;
  &::before { // 해당 요소의 내용 앞에 가상의 콘텐츠를 추가
    content: ${({ $isSelected }) => ($isSelected ? "'— '" : "''")};
    color: #82624D;
  }
`;
const RoomContent = styled.div`
  text-align: left;
  font-size: 20px;
`;
const SelectedRoom = styled.div`
  text-align: center;
`;
const RoomImage = styled.img`
  max-width: 100%;
  width: 550px;
  height: 350px;

  object-fit: cover;
`;
const RoomImagesContainer = styled.div`
  margin-bottom: 20px;
  display: flex; /* 이미지가 부모 div 꽉 참 */
`;

const FacilityInfo = styled.div`
  text-align: center;
  overflow: hidden;
`;
const FacilityTitle = styled.div`
  font-size: 36px;
  color: white;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;  // 버튼과 이미지 사이 간격 조정
  width: 100%;
  position: relative;
  margin-top: 50px;
`;

const FacilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const FacilityItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
  position: relative;
  opacity: ${(props) => (props.$isFaded ? "0.5" : "1")};
  transition: all 0.3s ease-in-out;
`;

const FacilityLink = styled.div`
  position: relative;
  width: 30%;
  cursor: pointer;
`;

const FacilityImage = styled.img`
  width: 720px;
  height: 400px;
  object-fit: cover;
  align-items: center;
  display: block;
  margin: 0 auto;
`;

const FacilityText = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  margin-top: 10px;
  padding: 0 10px;
`;

const FacilityTextTitle = styled.span`
  flex: 0 0 auto;
  width: 35%;
  text-align: left;
  font-size: 26px;
`;

const FacilityTextContent = styled.span`
  flex: 1;
  text-align: left;
  line-height: 1.5;
  font-size: 16px;
`;

const FacilityButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -50px;
  margin-left: 15px;
  margin-right: 15px;
`;

const FacilityLeftButton = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const FacilityRightButton = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const EventInfo = styled.div`
  max-width: 55%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
`;

const EventTitle = styled.div`
  font-size: 36px; 
  text-align: left;
  margin-bottom: 25px;
`;
const EventViewMoreButton = styled.div`
  font-size: 16px; 
  color: #83583B;
  text-align: right;
  margin-bottom: 7px;
  vertical-align: middle; 
`;
const StyledChevronRightViewMore = styled(ChevronRight)`
  margin-left: 5px;  // 아이콘과 텍스트 사이의 간격
  vertical-align: middle; 
  padding-bottom: 5px;
  color: #83583B;    
`;
const StyledChevronRight = styled(ChevronRight)`
  font-size: 28px !important;
  color: #83583B;    
`;

const EventImageWrapper = styled.div`
  position: relative;
  width: 295px;
  height: 405px;
`;
const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;
const EventWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  
`;

const EventItem = styled.div`
  position: relative;
  width: 30%;
  cursor: pointer;
`;

const EventTypeWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  background: white;
  vertical-align: center;
  text-align: left;
  padding: 16px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.$isHovered ? 1 : 0)};
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const EventType = styled.div`
  font-size: 20px;
  color: #83583B;
  width: 90%;
`;

const EventDetails = styled.div`
  width: 100%;
  padding-top: 10px;
  text-align: center;
  transition: opacity 0.3s ease-in-out; //
  opacity: ${(props) => (props.$isHovered ? 0 : 1)}; //
`;

const EventTextTitle = styled.div`
  width: inherit;
  font-size: 20px;
  color: #000;
`;

const EventPeriod = styled.div`
  font-size: 14px;
  margin-top: 5px;
  color: #000;
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 54%;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  margin-top: -180px;
`;

const LocationTitle = styled.div`
  text-align: left;
  font-size: 36px;
`;

const Location = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;

const MapContainer = styled.div`
  width: 553px;
  height: 360px;
  background-color: #ddd;
  // position: relative;
`;

const InfoContainer = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  font-size: 16px;
`;

const Divider = styled.hr`
  margin: 10px 0;
  border: none;
  height: 1px;
  background-color: #ccc;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 380px;
`;

const HighlightText = styled.p`
  color: #82624D;
`;
const FooterContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  //background: #333;
  color: white;
  //padding: 20px;
  text-align: center;
  transform: translateY(${({ $isVisible }) => ($isVisible ? "0%" : "100%")});
  transition: transform 0.3s ease-in-out;
`;

const HotelMainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 영역을 꽉 채우도록 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0; /* 이미지를 뒤로 보냄 */
`;

export default Main;

