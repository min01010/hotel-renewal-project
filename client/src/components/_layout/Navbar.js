import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import axios from "axios";
import styled from "styled-components";

const Navbar = () => {
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로를 가져오기 위해 사용

  // 현재 Redux에서 활성화된 섹션 가져오기
  const activeSection = useSelector((state) => state.activeSection.activeSection);
  const isWhiteSection = activeSection === 0 || activeSection === 3; // 첫 번째 섹션 여부 확인

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rooms/get-room-types");
        setRoomTypes(response.data.roomTypes);
      } catch (error) {
        console.error("객실 타입 가져오기 실패:", error);
      }
    };

    const fetchFacilityTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rooms/get-facility-types");
        setFacilityTypes(response.data.facilityTypes);
      } catch (error) {
        console.error("부가시설 타입 가져오기 실패:", error);
      }
    };

    fetchRoomTypes();
    fetchFacilityTypes();
  }, []);

  const onLogout = () => {
    dispatch(logout()); // logout 함수를 호출
    console.log("로그아웃 실행");
  };

  // 객실 클릭 시 첫 번째 객실 타입으로 이동
  const handleRoomClick = () => {
    if (roomTypes.length > 0) {
      navigate(`/rooms/${roomTypes[0].room_id}`); // 첫 번째 객실 타입의 페이지로 이동
    }
  };

  // 부가시설 클릭 시 첫 번째 부가시설 타입으로 이동
  const handleFacilityClick = () => {
    if (facilityTypes.length > 0) {
      navigate(`/facilities/${facilityTypes[0].facility_id}`); // 첫 번째 부가시설 타입의 페이지로 이동
    }
  };

  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null); // 마우스가 벗어나면 드롭다운을 숨김
  };

  // 메인 페이지 확인
  const isMainPage = location.pathname === "/";

  return (
    <Nav isMainPage={isMainPage}>
      <Link to="/">
          <Logo src={isWhiteSection && isMainPage ? "https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogo.svg?alt=media&token=ccec7e69-fc84-4f2b-a8ed-20a375e427a4" : "https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogo_black.svg?alt=media&token=17a85dbe-dfeb-4532-b5e5-097ab3e96460"} alt="Logo" />
        </Link>
      <NavList>
        {/* <Link to="/">
          <Logo src={isWhiteSection && isMainPage ? "https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogo.svg?alt=media&token=ccec7e69-fc84-4f2b-a8ed-20a375e427a4" : "https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Flogo_black.svg?alt=media&token=17a85dbe-dfeb-4532-b5e5-097ab3e96460"} alt="Logo" />
        </Link> */}
        <NavItemWrapper>
        <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
          <Link to="/reservation">예약</Link>
        </NavItemDiv>
        </NavItemWrapper>
        {/* <NavItemWrapper> */}
        <NavItemWrapper onMouseEnter={() => handleMouseEnter("rooms")} onMouseLeave={handleMouseLeave}>
          <NavItemDiv onClick={handleRoomClick} $isWhite={isWhiteSection} $isMainPage={isMainPage}>객실</NavItemDiv>
          <DropdownMenu $isOpen={activeDropdown === "rooms"}>
            {roomTypes.map((room) => (
              <DropdownMenuList key={room.room_id}>
                <DropdownItem to={`/rooms/${room.room_id}`}>{room.room_type}</DropdownItem>
              </DropdownMenuList>
            ))}
          </DropdownMenu>
        </NavItemWrapper>
        <NavItemWrapper onMouseEnter={() => handleMouseEnter("facilities")} onMouseLeave={handleMouseLeave}>
          <NavItemDiv onClick={handleFacilityClick} $isWhite={isWhiteSection} $isMainPage={isMainPage}>부가시설</NavItemDiv>
          <DropdownMenu $isOpen={activeDropdown === "facilities"}>
            {facilityTypes.map((facility) => (
              <DropdownMenuList key={facility.facility_id}>
                <DropdownItem to={`/facilities/${facility.facility_id}`}>{facility.facility_type}</DropdownItem>
              </DropdownMenuList>
            ))}
          </DropdownMenu>
        </NavItemWrapper>
        <NavItemWrapper>
          <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
            <Link to="/event-list">이벤트</Link>
          </NavItemDiv>
        </NavItemWrapper>
        <NavItemWrapper>
          <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
            <Link to="/notice" >공지사항</Link>
          </NavItemDiv>
        </NavItemWrapper>
        {/* <NavItemWrapper>
          <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
            <Link to="/upload-image">이미지 업로드</Link>
          </NavItemDiv>
        </NavItemWrapper> */}
        {/* {user && user.id ? ( */}
        {user ? (
          <>
            <NavItemWrapper>
              <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
                <Link to="/myPage">마이페이지</Link>
              </NavItemDiv>
            </NavItemWrapper>
            <NavItemWrapper>
              <LogoutButton $isWhite={isWhiteSection} $isMainPage={isMainPage} onClick={onLogout}>로그아웃</LogoutButton>
            </NavItemWrapper>
          </>
        ) : (
          <NavItemWrapper>
            <NavItemDiv $isWhite={isWhiteSection} $isMainPage={isMainPage}>
              <Link to="/login">로그인/회원가입</Link>
            </NavItemDiv>
          </NavItemWrapper>
        )}
      </NavList>
    </Nav>
  );
};

const Logo = styled.img`
  margin-left: 50px;
  //max-width: 150px; /* 로고의 최대 너비 설정 */
  max-width: 180px; /* 로고의 최대 너비 설정 */
  height: auto; /* 비율에 맞게 높이 자동 조정 */
  display: block; /* 이미지가 블록처럼 동작하도록 */
  flex-shrink: 0; /* 로고가 줄어들지 않게 고정 */
  object-fit: contain; /* 로고 비율을 유지하면서 크기를 맞춤 */
`;
// 스타일 코드
const Nav = styled(({ isMainPage, ...rest }) => <nav {...rest} />)`
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ isMainPage }) => (isMainPage ? "none" : "4px 0 12px rgba(0, 0, 0, 0.2)")};
  background-color: rgba(255, 255, 255, 0); /* 배경 투명도 추가 */
  padding: 30px;
  position: ${({ isMainPage }) => (isMainPage ? "absolute" : "relative")};
  top: ${({ isMainPage }) => (isMainPage ? 0 : "auto")};
  left: 0;
  right: 0;
  z-index: 10;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin-right: 50px;
  gap: 45px;
`;

const LogoutButton = styled(({ $isWhite, $isMainPage, ...rest }) => <button {...rest} />)`
  color: ${({ $isWhite, $isMainPage }) => (!$isMainPage ? "black" : $isWhite ? "white" : "black")};
  font-size: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const NavItemWrapper = styled.li`
  position: relative;
`;

const NavItemDiv = styled.div`
  color: ${({ $isWhite, $isMainPage }) => (!$isMainPage ? "black" : $isWhite ? "white" : "black")};
  text-decoration: none;
  font-size: 20px;
  padding: 0px 15px;
  display: block;
  cursor: pointer;

  a {
    color: inherit; /* 부모의 색상 상속 */
    text-decoration: none; /* 기본 링크 밑줄 제거 */
  }
  &:hover {
    text-decoration: underline;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%); /* 중앙 정렬 */
  background: white;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  align-items: center;
  font-size: 18px;
  text-align: center;
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease-in-out, visibility 0s 0.3s;
  z-index: 100;
`;

const DropdownMenuList = styled.div`
  padding: 10px 20px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px;
  color: black;
  // color: white;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: #f1f1f1;
  }
`;


export default Navbar;
