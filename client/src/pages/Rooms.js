import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import ExplainForm from "../components/Forms/ExplainForm";

const Rooms = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    // 객실 정보 가져오기
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/rooms/get-room-info/${roomId}`);
        setRoom(response.data.room);
      } catch (error) {
        console.error("객실 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId, user]);

  if (loading) return <p>객실 정보를 불러오는 중...</p>;
  if (!room) return <p>객실 정보를 찾을 수 없습니다.</p>;

  return (
    <Container>
      <ExplainForm 
        isRoomPage={true} 
        explainObject={room} 
      />
    </Container>
  );
};

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
`;
export default Rooms;
