import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const MyPageNav = ({ onSelect }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const userState = useSelector((state) => state.user.userInfo);
  const method = userState?.method;
  
  return (
    <Nav>
      <NavItem onClick={() => onSelect("reservations")}>객실 예약 내역</NavItem>
      <NavItem onClick={() => onSelect("wishlist")}>관심 리스트</NavItem>

      {/* 개인정보관리 토글 */}
      <NavItem onClick={() => setIsProfileOpen(!isProfileOpen)}>
        개인정보관리 <span>{isProfileOpen ? <FiChevronUp size={25}/> : <FiChevronDown size={25}/>}</span>
      </NavItem>
      <SubMenu isOpen={isProfileOpen}>
        {method === "local" && (
          <>
            <SubNavItem onClick={() => onSelect("profile")}>회원정보 수정</SubNavItem>
            <SubNavItem onClick={() => onSelect("password")}>비밀번호 변경</SubNavItem>
          </>
        )}
        <SubNavItem onClick={() => onSelect("withdraw")}>회원 탈퇴</SubNavItem>
      </SubMenu>
    </Nav>
  );
};

const Nav = styled.nav`
  background-color: #7A5C48;
  color: #F5F3F0;
  padding: 80px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  height: 100%;
`;

const NavItem = styled.button`
  display:flex;
  background: none;
  border: none;
  text-align: left;
  font-size: 22px;
  padding: 15px 0px;
  cursor: pointer;
  width: 100%;
  &:hover {
    color: black;
  }
  span {
    margin-left: 5px;
    align-items:center;
  }
`;

// React는 HTML 표준 속성에 없는 isOpen 같은 커스텀 속성을 DOM에 전달하는 것을 허용하지 않음.
const SubMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen" // `isOpen` prop을 DOM에 전달하지 않음
})`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  padding-left: 15px;
`;

const SubNavItem = styled(NavItem)`
  font-size: 20px;
  padding: 15px 0px;
`;

export default MyPageNav;
