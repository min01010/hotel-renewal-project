import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NoticeDetail = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/notice/get-notice-info/${noticeId}`);
        setNotice(response.data.notice);
      } catch (error) {
        console.error("공지사항 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [noticeId]);

  if (loading) return <p>공지사항을 불러오는 중...</p>;
  if (!notice) return <p>공지사항을 찾을 수 없습니다.</p>;

  return (
    <Container>
      {/* <Title>공지사항</Title> */}
      <NoticeTitle>{notice.title}</NoticeTitle>
      <NoticeDate>등록일: {new Date(notice.created_at).toLocaleDateString()}</NoticeDate>
      <Content>{notice.content}</Content>
      <NoticeListButtonContainer>
        <StyledLink to="/notice">
          <Button>목록으로 이동</Button>
        </StyledLink>
      </NoticeListButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  flex-wrap: wrap;
  margin: 8% 15%;
  min-height: 400px;
`;

const NoticeTitle = styled.p`
  width: 100%;
  margin: 20px 0px; 
  font-size: 40px;  
  font-weight: bold;
  white-space: pre-line; 
  border-bottom: 1px solid #ccc;
  padding-bottom: 30px;
`;

const NoticeDate = styled.p`
  font-size: 20px;
  color: #666;
`;

const Content = styled.p`
  margin: 80px 0px;
  font-size: 24px;
  white-space: pre-line; 
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
const NoticeListButtonContainer = styled.div`
  margin: 70px;
  display: flex;
  justify-content: center; 
`
const StyledLink = styled(Link)`
  text-decoration: none;
`;

export default NoticeDetail;
