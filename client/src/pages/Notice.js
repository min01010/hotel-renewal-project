import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 10;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/notice/get-all-notices");
        setNotices(response.data.notices);
      } catch (error) {
        console.error("공지사항 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  if (loading) return <p>공지사항을 불러오는 중...</p>;
  if (!notices.length) return <p>공지사항이 없습니다.</p>;

  return (
    <Container>
      <Title>공지사항</Title>
      <Table>
        <thead>
          <tr>
            <th>순번</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {currentNotices.map((notice, index) => (
            <tr key={notice.id}>
              <td>{indexOfFirstNotice + index + 1}</td>
              <td>
                <StyledLink to={`/notice/${notice.id}`}>{notice.title}</StyledLink>
              </td>
              <td>{new Date(notice.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </Pagination>
    </Container>
  );
};

const Container = styled.div`
  flex-wrap: wrap;
  margin: 3% 15% 10% 15%;
  min-height: 400px;
`;
const Title = styled.div`
  font-size: 40px;
  margin-bottom: 30px;
`;
const Table = styled.table`
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  text-align: left;
  font-size: 18px;
  
  th {
    border-bottom: 1px solid black;
  }

  th, td {
    padding: 20px;
  }
  td  {
    border-bottom: 1px solid #ccc;
    height: 80px;
    letter-spacing: 2px;
  }
  th:first-child  {
    width: 120px;
  }
  td:first-child  {
    padding-left: 30px;
  }
  th:last-child {
    text-align: right;
  }
  td:last-child {
    text-align: right;
  }

`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 5px;
  button {
    padding: 5px 10px;
    border: 1px solid #ddd;
    cursor: pointer;
    background: #fff;
  }
`;

const StyledLink= styled(Link)`
  color: black;
  &:visited,
  &:hover,
  &:focus,
  &:active {
    color: black; /* hover, focus, active 상태에서도 같은 색상 유지 */
  }
`
export default Notices;
