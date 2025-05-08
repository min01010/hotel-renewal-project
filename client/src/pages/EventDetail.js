import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/events/get-event-info/${eventId}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error("이벤트 상세정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p>이벤트 상세정보를 불러오는 중...</p>;
  if (!event) return <p>이벤트를 찾을 수 없습니다.</p>;

  return (
    <EventDetailContainer>
        <EventName>{event.event_name}</EventName>
        <EventImage src={event.Images.length > 0 ? event.Images[0].image_url : ""} alt="이벤트 이미지" />
        <EventTitle>{event.title}</EventTitle>
        <EventInfo>{event.info}</EventInfo>
        <EventDetails>
          <EventInfoBlock>
            <EventInfoTitle>위치</EventInfoTitle>
            <p>{event.location}</p>
          </EventInfoBlock>

          <EventInfoBlock>
            <EventInfoTitle>운영기간</EventInfoTitle>
            <p>{event.period}</p>
          </EventInfoBlock>

          <EventInfoBlock>
            <EventInfoTitle>운영시간</EventInfoTitle>
            <p>{event.time}</p>
          </EventInfoBlock>

          <EventInfoBlock>
            <EventInfoTitle>안내사항</EventInfoTitle>
            <p>{event.notice}</p>
          </EventInfoBlock>

          <EventInfoBlock>
            <EventInfoTitle>이벤트 구성</EventInfoTitle>
            <p>{event.composition}</p>
          </EventInfoBlock>
        </EventDetails>
        <EventListButtonContainer>
          <StyledLink to="/event-list">
            <Button>목록으로 이동</Button>
          </StyledLink>
        </EventListButtonContainer>
    </EventDetailContainer>
  );
};

const EventDetailContainer = styled.div`
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  padding: 5% 15%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const EventName = styled.div`
  font-family: 'Shippori Mincho', serif;
  text-align: center;
  font-size: 40px;
  margin: 15px;
`;

const EventImage = styled.img`
  width: 80%;
  height: auto;
  margin: 40px 0px;
`;

const EventTitle = styled.h2`
  font-size: 30px;
  margin: 30px 0px;
`;
const EventInfo = styled.p`
  width: 80%;
  font-size: 24px;
  color: #666;
  line-height: 35px;
  margin: 40px 0px;
  text-align: center;
`;


const EventDetails = styled.div`
  margin-top: 100px;
  width: 80%;

  h4 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const EventInfoBlock = styled.div`
  margin-bottom: 40px;

  p {
    font-size: 20px;
    color: #444;
    margin-top: 20px;
  }
`;

const EventInfoTitle = styled.h5`
  width: 100%;
  font-size: 28px;
  border-bottom: 1px solid #ccc;
  padding: 20px 0px;
`;

const Button = styled.button`
  flex: 1;
  padding: 15px 30px;
  font-size: 24px;
  border-radius: 5px;
  border: 1px solid black;
  cursor: pointer;
  color: black;

    &:hover {
        color: white;
        background-color: #5C3D2E;
    }
`;
const EventListButtonContainer = styled.div`
  margin: 70px;
  display: flex;
  justify-content: center; 
`
const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default EventDetail;
