import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MyPageNav from "../components/Mypage/MyPageNav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReservationList from "../components/Mypage/ReservationList";
import Withdraw from "../components/Mypage/Withdraw";
import PasswordChange from "../components/Mypage/PasswordChange";
import UserInfoModify from "../components/Mypage/UserInfoModify";
import Wishlist from "../components/Mypage/Wishlist";

const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("reservations");
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const user = userState ? userState.userInfo : null; 

  useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "reservations":
        return <ReservationList />;
      case "wishlist":
        return <Wishlist />;;
      case "profile":
        return <UserInfoModify />;
      case "password":
        return <PasswordChange />;
      case "withdraw":
        return <Withdraw />;;
      default:
        return <ReservationList />;
    }
  };

  return (
    <Container>
      <NavWrapper>
        <MyPageNav onSelect={setSelectedMenu} />
      </NavWrapper>
      <Content>{renderContent()}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;
const NavWrapper = styled.div`
  width: 317px;
  flex-shrink: 0;
`;
const Content = styled.div`
  width: calc(100% - 317px);
`;



export default MyPage;
