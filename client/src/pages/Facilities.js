import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import ExplainForm from "../components/Forms/ExplainForm";

const Facilities = () => {
  const { facilityId } = useParams();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.Info);

  useEffect(() => {
    // 부가시설 정보 가져오기
    const fetchFacilityData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/rooms/get-facility-info/${facilityId}`);
        setFacility(response.data.facility);
      } catch (error) {
        console.error("부가시설 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilityData();
  }, [facilityId, user]);


  if (loading) return <p>부가시설 정보를 불러오는 중...</p>;
  if (!facility) return <p>부가시설 정보를 찾을 수 없습니다.</p>;

  return (
    <Container>
      <ExplainForm explainObject={facility} />
    </Container>
  );
};

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
`;

export default Facilities;
