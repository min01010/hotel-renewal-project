import { useEffect } from "react";
import styled from 'styled-components';

const PopupForm = ({ message, popupType, onAccept, onReject, onClose }) => {
  
  useEffect(() => {
    // 팝업이 열릴 때 스크롤 막기
    document.body.style.overflow = 'hidden';

    // 팝업이 닫힐 때 스크롤 다시 가능하게
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const popupDetail = {
    info: { title: '안내 메세지' },
    success: { title: '안내 메세지' },
    error: { title: '오류 메세지' },
  };

  return (
    <Overlay>
      <PopupContainer $popupType={popupType}>
        <PopupTitle>{popupDetail[popupType]?.title}</PopupTitle>
        <Divider/>
        <PopupMessage>{message}</PopupMessage>
        <PopupButtonContainer>
          {/* {통합할 때, 삭제, 탈퇴 등등} */}
          {onAccept && <PopupButton onClick={onAccept}>확인</PopupButton>}
          {onReject && <PopupButton $isCancel onClick={onReject}>취소</PopupButton>}
          {/* {확인 버튼만 필요한 경우(닫기 기능만 할 때)} */}
          {onClose && <PopupButton onClick={onClose}>확인</PopupButton>}
        </PopupButtonContainer>
      </PopupContainer>
    </Overlay>
  );
};
  
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  // 어두운 배경
  z-index: 998;  // 팝업보다 뒤에
`;

const PopupContainer = styled.div`
  background: white;
  width: 500px;
  height: 230px;
  padding: 30px;
  border-radius: 4px;
  border: 1px solid #777;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 상단~하단 공간 분배 */
`;

const PopupTitle = styled.p`
  font-size: 20px;
`
const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #ccc;
  width: 440px;
`;

const PopupMessage = styled.p`
  font-size: 18px;
  margin: 20px 0px;
`;

const PopupButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const PopupButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: ${({ $isCancel }) => ($isCancel ? '#977B64' : 'white')};
  background: ${({ $isCancel }) => ($isCancel ? 'white' : '#977B64')};
  border: 1px solid #977B64;
  border-radius: 4px;
  margin-left: 15px;
`;


export default PopupForm;
