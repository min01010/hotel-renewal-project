import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import styled from "styled-components";

const TermsForm = ({ onTermsChange }) => { 
  const [terms, setTerms] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState({});
  const [mandatoryTerms, setMandatoryTerms] = useState([]);

  const userState = useSelector((state) => state.user.userInfo);
  const user = userState ? userState : null; 

  useEffect(() => {
    const fetchTerms = async () => {
      if (!user) return;
      try {
        const response = await axios.get("http://localhost:3001/api/users/get-terms");

        if (response.status === 200) {
          setTerms(response.data.terms);

          // 필수 약관 ID 목록 저장
          const mandatoryIds = response.data.terms
            .filter((term) => term.is_mandatory)
            .map((term) => term.id);
          setMandatoryTerms(mandatoryIds);

          // 모든 약관을 false로 초기화
          const initialSelectedTerms = {};
          response.data.terms.forEach((term) => {
            initialSelectedTerms[term.id] = false;
          });
          setSelectedTerms(initialSelectedTerms);

        }
      } catch (error) {
        console.error("약관 정보 불러오기 실패:", error);
      }
    };
    fetchTerms();
  }, [user]);

  // 상태 업데이트 후 부모로 전달
  useEffect(() => {
    if (mandatoryTerms.length > 0 && Object.keys(selectedTerms).length > 0) {
      onTermsChange(mandatoryTerms, selectedTerms);  // 부모 컴포넌트로 상태 전달
    }
  }, [mandatoryTerms, selectedTerms, onTermsChange]); // 변경된 mandatoryTerms, selectedTerms가 있을 때마다 호출

  const handleChange = (id, value) => {
    setSelectedTerms((prev) => {
      const updatedTerms = { ...prev, [id]: value };
      return updatedTerms;
    });
  };

  return (
    <Container>
      {terms.map((term) => (
        <TermItem key={term.id}>
          <StyledLabel>
            <StyledCheckbox
              type="checkbox"
              name={term.id}
              checked={selectedTerms[term.id] || false}
              onChange={(e) => handleChange(term.id, e.target.checked)}
            />
            <TermText>{term.is_mandatory ? '[필수]' : '[선택]'} {term.content}</TermText>
          </StyledLabel>
        </TermItem>
      ))}
    </Container>
  );
};

export default TermsForm;

// styled-components 정의
const Container = styled.div`
  margin-top: 10px;
`;

const TermItem = styled.div`
  margin-bottom: 10px;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;
  gap: 10px;
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
`;

const TermText = styled.span`
  line-height: 1.5;
`;