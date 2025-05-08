import React from "react";
import SignupForm from "../components/Forms/SignupForm";
import styled from "styled-components";

const SignupPage = () => {
  return (
    <Container>
      <SignupBox>
        <Title>회원가입</Title>
        <SignupForm />
      </SignupBox>
    </Container>
  );
};

const Container = styled.div`
  // display: flex;
  // justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 5% 10% 5% 20%;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 40px;
  margin-left: -10%;
`;
const SignupBox = styled.div`
  width: 100%;
`;


export default SignupPage;
