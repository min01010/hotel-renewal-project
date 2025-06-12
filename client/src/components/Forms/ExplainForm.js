import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PopupForm from "./PopupForm";
import styled from "styled-components";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import useFetchWithToken from "../../hooks/useFetchWithToken";

const ExplainForm = ({isRoomPage, explainObject }) => {
    const info1 = isRoomPage ? explainObject.amenities_basic : explainObject.location;
    const info2 = isRoomPage ? explainObject.amenities_bedroom : explainObject.period;
    const info3 = isRoomPage ? explainObject.amenities_bathroom : explainObject.hours_of_operation;

    const { roomId } = useParams();
    const [popupData, setPopupData] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const navigate = useNavigate();
    const { fetchWithToken } = useFetchWithToken();
    const user = useSelector((state) => state.user.userInfo);
    const scrollTargetRef = useRef(null);
      
    useEffect(() => {
      console.log("user?", user);
      console.log("user.id?", user.id);
      if(isRoomPage) {
        // 위시리스트에 존재하는지 확인
        const checkWishlist = async () => {
        if (user) {
            try {
            const response = await fetchWithToken(
                `http://localhost:3001/api/users/check-if-liked?userId=${user.id}&roomId=${roomId}`
            );
            
            setIsWishlisted(response.data.isWishlisted);
            } catch (error) {
            console.error("위시리스트 확인 실패:", error);
            }
        }
      };
      checkWishlist();
    }
    }, [roomId, user]);

      // 하트 클릭 시 동작
    const toggleWishlist = async () => {
      if (!user) {
        setPopupData({
          popupType: "info",
          message: "로그인 후 이용가능합니다. 로그인 하시겠습니까?",
        });
        return;
      }

      try {
        const url = isWishlisted
          ? "http://localhost:3001/api/users/delete-user-wishlist"
          : "http://localhost:3001/api/users/create-user-wishlist";

      // 먼저 상태를 반영한 후 서버 요청
      setIsWishlisted((prevState) => !prevState);
      const response = await fetchWithToken(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_unique_id: user.id,
          room_id: roomId,
        }),
      });
      } catch (error) {
        setIsWishlisted((prevState) => !prevState);
        console.error("위시리스트 변경 실패:", error);
        alert("오류가 발생했습니다.");
      }
    };
    // 화살표 클릭 시 밑으로 스크롤
    const handleScrollDown = () => {
        if (scrollTargetRef.current) {
          scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
        }
      };
      
    return (
        <Container>
            <ImageBox src={explainObject.Images.length > 0 ? explainObject.Images[0].image_url : ""} alt={"타이틀 이미지"}/>
            <ImageText>
              {isRoomPage ? explainObject.room_type: explainObject.facility_type}
              <Title>{explainObject.title}</Title>
            </ImageText>
            <DownArrow src={"https://firebasestorage.googleapis.com/v0/b/hotel-cd8ab.firebasestorage.app/o/images%2Fdown_arrow.svg?alt=media&token=a807e85e-15b8-46df-b798-90ed7a01563f"} alt={"화살표 이미지"} onClick={handleScrollDown}/>
            <ExplainContainer ref={scrollTargetRef}>
              <Introduction>
                {isRoomPage && (
                  <ButtonContainer>
                    <HeartButton onClick={toggleWishlist}>
                      {isWishlisted ? (
                        <FaHeart color="red" height="100%"/>
                      ) : (
                        <FaRegHeart color="black" height="100%"/>
                      )}
                      <ButtonText>관심 상품</ButtonText>
                    </HeartButton>
                    <StyledLink to="/reservation">
                      <Button>예약하기</Button>
                    </StyledLink>
                  </ButtonContainer>
                )}
                  
                <Description>{isRoomPage ? explainObject.description : explainObject.info}</Description>
              </Introduction>
              <Guidance>
                <Information>이용 안내</Information>
                <InfoDiv>
                  <InfoTitle>{isRoomPage ? "기본 편의 시설" : "위치"}</InfoTitle>
                  <Info>{info1}</Info>
                </InfoDiv>
                <InfoDiv>
                  <InfoTitle>{isRoomPage ? "침실 편의 시설" : "운영기간"}</InfoTitle>
                  <Info>{info2}</Info>
                </InfoDiv>
                <InfoDiv>
                  <InfoTitle>{isRoomPage ? "욕실 편의 시설" : "운영시간"}</InfoTitle>
                  <Info>{info3}</Info>
                </InfoDiv>
              </Guidance>
              <div>
                <NoticeTitle>안내 사항</NoticeTitle>
                <Notice>{isRoomPage ? explainObject.notice:explainObject.regulation}</Notice>
              </div>
              <MainButtonContainer>
                <StyledLink to="/">
                  <Button>메인으로 이동</Button>
                </StyledLink>
              </MainButtonContainer>
            </ExplainContainer>

            {popupData && (
              <PopupForm
                message={popupData.message}
                popupType={popupData.popupType}
                onAccept={() => navigate("/login")}
                onReject={() => setPopupData(null)}
              />
            )}
        </Container>
    )
}

const Container = styled.div`
  width:100%;
`
const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  max-height: calc(100vh - 100px);
`
const ImageText = styled.div`
  font-family: 'Shippori Mincho', serif;
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  width: 100%;
  font-size: 110px;
  text-align: center;
  transform: translate(-50%, -50%);
`
const DownArrow = styled.img`
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
`
const ExplainContainer = styled.div`
  width: 100%;
  padding: 5% 15%;
  align-items: center;
`

const Introduction = styled.div`
  text-align: center;
`
const Title = styled.div`
  font-family: 'Nanum Myeongjo', serif;
  font-size: 34px;
  margin-top: 30px;
  letter-spacing: 2px; /* 글자 간 간격 */
  padding: 0px 450px;
`
const Description = styled.div`
  font-size: 24px;
  color: #666;
  line-height: 35px;
  padding: 0px 20px;
`
const Guidance = styled.div`
  margin: 180px 0px 100px 0px;
`
const Information = styled.h3`
  font-size: 28px;
  margin-bottom: 30px;
`
const InfoDiv = styled.div`
  width: 100%;
  border-top: 1px solid #ccc;
  padding: 35px 20px;
  display: flex;
`
const InfoTitle = styled.span`
  font-size: 24px;
  margin-right: 200px;
  display: flex;
  align-items: center;
  width: 200px;
`
const Info = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  white-space: pre-line;
  line-height: 40px;
`

const NoticeContainer = styled.div`
    
`
const NoticeDiv = styled.div`

`
const NoticeTitle = styled.h3`
  font-size: 28px;
  margin-bottom: 30px;
`
const Notice = styled.div`
  border-top: 1px solid #ccc;
  font-size: 20px;
  padding: 35px 20px;
  line-height: 35px;
  white-space: pre-line; /* DB에서 줄바꿈 되어있는 것 그대로 가져옴 */
`
const ButtonContainer = styled.div`
  margin-bottom: 70px;
  display: flex;
  justify-content: center; 
`

const MainButtonContainer = styled.div`
  margin: 70px;
  display: flex;
  justify-content: center; 
`

const HeartButton = styled.button`
  background: none;
  padding: 15px 30px;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
  margin-right: 20px;
  display: flex;
  align-items: center;
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
const ButtonText = styled.span`
  margin-left: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;


export default ExplainForm;
