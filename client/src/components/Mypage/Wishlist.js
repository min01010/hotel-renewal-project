import React, { useEffect, useState } from "react";
import useFetchWithToken from "../../hooks/useFetchWithToken";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Wishlist = () => {
  const user = useSelector((state) => state.user?.userInfo);
  const [wishlist, setWishlist] = useState([]);
  const { fetchWithToken } = useFetchWithToken();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 위시리스트 조회 
    const getWishlist = async () => {
      if (!user) return;
      setLoading(true);  // 로딩 시작
      try {
        const response = await fetchWithToken(`http://localhost:3001/api/users/get-user-wishlist?userId=${user.id}`);
        if (response.status === 200) {
          //setWishlist(response.data.wishlist);
          setWishlist(response.data.wishlist);
        } else {
          console.error("위시리스트 조회 실패:", response.message);
        }
      } catch (error) {
        console.error("위시리스트 조회 실패:", error);
      } finally {
        setLoading(false);  // 로딩 종료
      }
    };
    getWishlist();
  }, [user]);
  // 위시리스트 삭제 
  const handleDelete = async (roomId) => {
    try {
      const response = await fetchWithToken("http://localhost:3001/api/users/delete-user-wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_unique_id: user.id,
          room_id: roomId,
        }),
      });
      setWishlist((prev) => prev.filter((item) => item.room_id !== roomId));
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  return (
    <Container>
      <Title>관심 리스트</Title>
      {loading ? ( // 로딩 중일 때
        <p>로딩 중...</p>
      ) : wishlist && wishlist.length > 0 ? (
        <List>
          {wishlist.map((item) => (
            <Item key={item.room_id}>
              <WishlistDiv>
                <WishlistRoomImage src={item.room.Images[0].image_url} alt="예약된 객실 이미지"/>
                <WishlistInfo>
                  <span>{item.room.room_type}</span>
                  <p>{item.room.title}</p>
                </WishlistInfo>
              </WishlistDiv>

              
              <Buttons>
                <button onClick={() => handleDelete(item.room_id)}>삭제</button>
                <button onClick={() => window.location.href = `/rooms/${item.room_id}`}>상세보기</button>
              </Buttons>
            </Item>
          ))}
        </List>
      ) : (
        <p>관심 상품이 없습니다.</p>
      )}
    </Container>
  );
}
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

const WishlistRoomImage = styled.img`
  display: flex;
  width: 300px;
`;

const List = styled.div`
  font-family: 'Pretendard', sans-serif;
  margin-bottom: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 40px;
  border-bottom: 1px solid #ddd;
`;
const WishlistDiv = styled.div`
  display: flex;
`;
const WishlistInfo = styled.div`
  font-size: 20px;
  width: 100%;
  line-height: 30px;
  margin: 20px 40px;

  span {
    font-size: 28px;
  }
  p {
    color: #555;
    margin-top: 10px;
  }
`;

const Buttons = styled.div`
  margin-left: auto;
  margin-top: auto;
  display: flex;
  font-size: 20px;
  gap: 10px;

  button {
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 3px;
  }

  button:first-child {
    background-color: white;
    border: 1px solid #5C3D2E;
    color: #5C3D2E;
  }

  button:last-child {
    background-color: #5C3D2E;
    color: white;
  }
`;

export default Wishlist;
