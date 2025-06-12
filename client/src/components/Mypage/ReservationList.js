import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import PopupForm from "../Forms/PopupForm";
import useFetchWithToken from "../../hooks/useFetchWithToken";
import { useNavigate } from "react-router-dom";

const ReservationList = () => {
  const { fetchWithToken } = useFetchWithToken();  // 훅을 호출하여 fetchWithToken 가져오기
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const userId = user ? user.id : null;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchReservations(userId);
    }
  }, [user, navigate]);

  const fetchReservations = async (userId) => {
    if (!userId) return;
    try {
        // fetchWithToken을 사용해 서버로 예약 취소 요청 전송
        const response = await fetchWithToken(
          `http://localhost:3001/api/reserv/get-user-reservations?user_id=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (response.status === 200) {
          setReservations(response.data);
          setPopupData(null);
          setCurrentPage(1); 
        } else {
          console.log("예약 내역이 없습니다.");
          setReservations([]);
        }
      } catch (error) {
        console.error("예약 내역 불러오기 실패:", error);
      }finally {
        setLoading(false);
      }
  };

  const cancelReservation = async (reservationId) => {
      try {
        // fetchWithToken을 사용해 서버로 예약 취소 요청 전송
        const response = await fetchWithToken(
          "http://localhost:3001/api/reserv/delete-user-reservation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reservation_id: reservationId,
              }),
          }
        );
        if (response.status === 200) {
          fetchReservations(userId); // fetchReservations()를 호출할 때 userId를 전달해야 기존 예약 내역이 바로 갱신됨.
           // 예약 취소가 성공한 경우
          setPopupData(null);
        }
       
        //기존 코드(fetchReservations())는 userId를 함수 내부에서 참조하므로, 실행 시점에 userId가 undefined라면 문제가 발생할 수 있음.
        //명시적으로 인자를 전달하면, 실행 시점에 항상 userId가 올바르게 설정되므로 최신 데이터를 즉시 가져올 수 있음.

      } catch (error) {
        console.error("예약 취소 실패:", error);
      }
  };


  const handleCancelReservation = (reservationId) => {
    setPopupData({
      popupType: "info", 
      message: "예약을 취소하시겠습니까?",
      onAccept: () => cancelReservation(reservationId), // 예약 취소 함수
      onReject: () => handlePopupClose(), // 팝업 닫기
    });
  };
  const handlePopupClose = () => {
    setPopupData(null); // 팝업 닫기
  };


  if (loading) return <p>로딩 중...</p>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);
  
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Title>예약 내역</Title>
      {currentReservations.map((reservation) => (
        <ReservationCard key={reservation.reservation_id}>
          <ReservationNumber>예약 번호 <span>{reservation.reservation_number.slice(0, 8)}</span></ReservationNumber>
          <ReservationCardDivide>
            <ReservedRoomImage src={reservation.room.Images[0].image_url} alt="예약된 객실 이미지"/>
            <ReservationDiv>
              <table>
                <tbody>
                  <tr>
                    <th>객실</th>
                    <td>{reservation.room.room_type}</td>
                  </tr>
                  <tr>
                    <th>숙박 기간</th>
                    <td>{reservation.check_in_date} - {reservation.check_out_date}</td>
                  </tr>
                  <tr>
                    <th>상태</th>
                    <td>{reservation.status}</td>
                  </tr>
                </tbody>
              </table>    
            </ReservationDiv> 
            <ButtonDiv>
              {reservation.status !== "취소 완료" ? (
                <CancelButton onClick={() => handleCancelReservation(reservation.reservation_id)}>
                  예약 취소
                </CancelButton>
              ) :  <p>취소 완료</p> }
            </ButtonDiv>
          </ReservationCardDivide>
        </ReservationCard>
      ))}

      <Pagination>
        <ArrowButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </ArrowButton>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <PageButton
            key={number}
            onClick={() => handlePageChange(number)}
            $active={number === currentPage}
          >
            {number}
          </PageButton>
        ))}

        <ArrowButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </ArrowButton>
      </Pagination>

      {popupData && (
        <PopupForm
          popupType={popupData.popupType}
          message={popupData.message}
          onAccept={popupData.onAccept}
          onReject={popupData.onReject}
        />
      )}
    </Container>
  );
};

export default ReservationList;

const Container = styled.div`
  flex-wrap: wrap;
  margin: 3% 15% 10% 15%;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 30px;
`;
const ReservationCard = styled.div`
  font-family: 'Pretendard', sans-serif;
  border-bottom: 1px solid #ddd;
  padding: 30px;
  margin-bottom: 10px;
`;
const ReservationNumber = styled.div`
  // font-weight: bold;
  display: flex;
  font-size: 24px;
  span{
    font-size: 22px;
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: #777;
  }
`;

const ReservationCardDivide = styled.div`
  margin-top: 10px;
  display: flex;
`;

const ReservationDiv = styled.div`
  margin: 20px 40px;
  line-height: 30px;
  font-size: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    padding: 4px 16px;
    color: #555;
    width: 130px;
  }

  td {
    padding: 4px 8px;
    color: #222;
  }
`;
const ReservedRoomImage = styled.img`
  display: flex;
  width: 300px;
  margin-top: 20px;
`;
const ButtonDiv = styled.div`
  margin-top: auto;
  margin-left: auto;
  font-size: 20px;

  p {
    padding: 10px 20px;
  }
`;

const CancelButton = styled.button`
  background-color: #5C3D2E;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 3px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.$active ? "#7A5C48" : "#EFE9E5")};
  color: ${(props) => (props.$active ? "white" : "#3D2C23")};
  border: none;
  margin: 0 5px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #A4836B;
    color: white;
  }
`;

const ArrowButton = styled.button`
  background-color: transparent;
  border: 1px solid #C4B7AE;
  color: #7A5C48;
  margin: 0 5px;
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #F3ECE8;
  }
  &:disabled {
    color: #B5A49B;
    cursor: default;
    background-color: #F8F5F3;
  }
`;

