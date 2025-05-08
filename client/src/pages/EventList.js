import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Link 추가

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/events/get-all-events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("이벤트 데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>이벤트 정보를 불러오는 중...</p>;
  if (!events.length) return <p>이벤트가 없습니다.</p>;

  return (
    <EventContainer>
      <Title>이벤트</Title>
      <EventDiv>
        {events.map((event) => (
          <Link to={`/events/${event.event_id}`} key={event.event_id}> {/* 이벤트 상세 페이지로 이동 */}
            <EventCard>
              <EventImage src={event.Images.length > 0 ? event.Images[0].image_url:""} alt={event.name} />
              <EventTitle>{event.event_name}</EventTitle>
              <EventDescription>{event.title}</EventDescription>
              <EventPeriod>{event.period}</EventPeriod>
            </EventCard>
          </Link>
        ))}
      </EventDiv>
    </EventContainer>
  );
};

const EventContainer = styled.div`
  flex-wrap: wrap;
  margin: 3% 15% 10% 15%;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 30px;
`;
const EventDiv = styled.div`
  display: flex;
  align-items: center;
  // justify-content: center;
  justify-content: space-between;
  width: 100%;
`;
const EventImage = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center;
  height: 220px;
  border-radius: 5px;
`;
const EventCard = styled.div`
  width: 420px;
  height: 470px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

const EventTitle = styled.h3`
  margin: 10px 0;
  font-size: 22px;
  color: black;
  padding: 20px 0px;
  height: 90px;
`;

const EventDescription = styled.p`
  font-size: 20px;
  color: #555;
`;

const EventPeriod = styled.p`
  padding-top: 15px;
  font-size: 18px;
  color: #888;
`;

export default EventList;
