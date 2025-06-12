import React from "react";
import styled from "styled-components";

const RoomInput = ({ roomIndex, room, handleAdultChange, handleChildChange, handleRemoveRoom }) => {
  const isFirstRoom = roomIndex === 0;

  return (
    <RoomSelectorContainer className="room">
      <RoomSelectHeader>
        <h4>객실 {roomIndex + 1}</h4>
        {!isFirstRoom && <RoomRemoveButton onClick={() => handleRemoveRoom(roomIndex)}>객실 제거</RoomRemoveButton>}
      </RoomSelectHeader>
      <RoomSelectordiv>
        <AdultCountdiv>
          <button onClick={() => handleAdultChange(roomIndex, -1)} disabled={room.adults <= 1}>-</button>
          <RoomSelectorLabel>성인 {room.adults}</RoomSelectorLabel>
          <button onClick={() => handleAdultChange(roomIndex, 1)} disabled={room.adults >= 4}>+</button>
        </AdultCountdiv>
        <ChildrenCountdiv>
          <button onClick={() => handleChildChange(roomIndex, -1)} disabled={room.children <= 0}>-</button>
          <RoomSelectorLabel>어린이 {room.children}</RoomSelectorLabel>
          <button onClick={() => handleChildChange(roomIndex, 1)} disabled={room.children >= 2}>+</button>
        </ChildrenCountdiv>
      </RoomSelectordiv>
    </RoomSelectorContainer>
  );
};

const RoomSelector = ({ rooms = [], setRooms }) => { // ✅ 기본값 추가
  if (!rooms || !setRooms) return null; // ✅ rooms나 setRooms가 없으면 렌더링 안 함
  const handleAdultChange = (roomIndex, change) => {
    const newRooms = [...rooms];
    const newAdultCount = newRooms[roomIndex].adults + change;
    if (newAdultCount >= 1 && newAdultCount <= 4) {
      newRooms[roomIndex].adults = newAdultCount;
      setRooms(newRooms);
    }
  };

  const handleChildChange = (roomIndex, change) => {
    const newRooms = [...rooms];
    const newChildCount = newRooms[roomIndex].children + change;
    if (newChildCount >= 0 && newChildCount <= 2) {
      newRooms[roomIndex].children = newChildCount;
      setRooms(newRooms);
    }
  };

  const handleAddRoom = () => {
    if (rooms.length < 3) {  // 객실이 3개 이하일 때만 추가 가능
      setRooms([...rooms, { adults: 1, children: 0 }]);
    }
  };

  const handleRemoveRoom = (roomIndex) => {
    setRooms(rooms.filter((_, index) => index !== roomIndex));
  };

  return (
    <RoomSelectorMainDiv>
      {rooms.map((room, index) => (
        <RoomInput
          key={index}
          roomIndex={index}
          room={room}
          handleAdultChange={handleAdultChange}
          handleChildChange={handleChildChange}
          handleRemoveRoom={handleRemoveRoom}
        />
      ))}
      {rooms.length < 3 && (  // 객실이 3개 미만일 때만 '객실 추가' 버튼 보이기
        <>
          <RoomAddLabel>객실 추가</RoomAddLabel>
          <RoomAddButton onClick={handleAddRoom}>+</RoomAddButton>
        </>
      )}
    </RoomSelectorMainDiv>
  );
};

const RoomSelectorContainer = styled.div`
  width: 100%; /* RoomSelector의 너비를 100%로 설정 */
  padding: 30px;
  //display: flex;
  flex-direction: column;
  display: inline-block;
  //align-items: left;
  align-items: flex-start; /* 왼쪽 정렬 */
  text-align: left;

  h4 {
    font-size: 20px;
  }
`;
const RoomSelectordiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

`;
const RoomSelectorMainDiv = styled.div`
  display: inline-block;
  width: 100%;
`;
const RoomSelectorLabel = styled.label`
  padding: 0px 10px;
  font-size: 18px;
`;

const RoomAddLabel = styled.label`
  font-size: 16px;
`;
const RoomAddButton = styled.button`
  //padding: 10px;
  padding: 6px 9px;
  margin-left: 6px;
  background-color: #83583B;
  color: white;
  font-size: 12px;
  border-radius: 50%;
`;
const RoomRemoveButton = styled.button`
  padding: 5px 8px;
  background-color: #A88C76;
  border-radius: 5%;
  color: white;
  font-size: 12px;
`;
const AdultCountdiv = styled.div`
  padding: 10px 0px;
  border-bottom: 1px solid #ccc;

  button {
    padding: 0px 7px;
  }
`;
const ChildrenCountdiv = styled.div`
  padding: 10px 0px;
  border-bottom: 1px solid #ccc;
  
  button {
    padding: 0px 7px;
  }
`;
const RoomSelectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  h4 {
    margin: 0;
  }
`;

export default RoomSelector;
