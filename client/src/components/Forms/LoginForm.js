import React, { useState } from "react";
import styled from "styled-components";

const LoginForm = ({ onSubmit, error }) => {
  const [localId, setLocalId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localId, password);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <LoginInput
          type="text"
          value={localId}
          onChange={(e) => setLocalId(e.target.value)}
          placeholder="아이디"
        />
        <LoginInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginButton type="submit">로그인</LoginButton>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoginInput = styled.input`
  all: unset; /* 기본 스타일 제거 */
  border-bottom: 1px solid #666; 
  box-sizing: border-box;
  padding: 15px 10px; 
  width: 100%;  
  font-size: 22px; 
  margin-bottom: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 60px;
  padding: 12px;
  margin-top: 20px;
  background-color: #5C3D2E;
  color: white;
  font-size: 20px;
  text-align: center;
  box-sizing: border-box;
  border: none;
`;

export default LoginForm;
