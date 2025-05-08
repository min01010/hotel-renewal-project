import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NaverCallback from './pages/NaverCallback';
import KakaoCallback from './pages/KakaoCallback';
import useAutoRefreshToken from "./hooks/useAutoRefreshToken";
import Layout from "./components/_layout/Layout";
import GlobalStyle from "./styles/globalStyles"; 
import Reservation from './pages/Reservation';
import ReservationOption from './pages/ReservationOption';
import ReservationComplete from './pages/ReservationComplete';
import Rooms from './pages/Rooms';
import Facilities from './pages/Facilities';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Notice from './pages/Notice';
import NoticeDetail from './pages/NoticeDetail';
import MyPage from './pages/MyPage';
import FileUpload from './components/FileUpload';

//import { useDispatch, useSelector } from "react-redux";

function App() {
    // useAutoRefreshToken();
    return (
        <>
            <GlobalStyle /> 
            <Router>
                <Layout>
                    <AutoRefreshTokenHandler />
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/signup" element={<Signup/>} />
                        <Route path="/login/callback" element={<Login />} />{" "}
                        <Route path="/naver-callback" element={<NaverCallback />} />
                        <Route path="/kakao-callback" element={<KakaoCallback />} /> 
                        <Route path="/reservation" element={<Reservation />} />
                        <Route path="/reservation-option" element={<ReservationOption />} />
                        <Route path="/reservation-complete" element={<ReservationComplete />} />
                        <Route path="/rooms/:roomId" element={<Rooms />} />
                        <Route path="/facilities/:facilityId" element={<Facilities />} />
                        <Route path="/events/:eventId" element={<EventDetail />} />
                        <Route path="/event-list" element={<EventList />} />
                        <Route path="/notice" element={<Notice />} />
                        <Route path="/notice/:noticeId" element={<NoticeDetail />} />

                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/upload-image" element={<FileUpload />} />
                        
                        {/* 콜백 경로 추가 */}
                    </Routes>
                </Layout>
            </Router>
        </>
    );
}

// AutoRefreshTokenHandler 컴포넌트
const AutoRefreshTokenHandler = () => {
    // const { isLoggedIn, logout } = useAuth(); // 로그인 상태와 logout 함수 가져오기

    // useAutoRefreshToken은 항상 호출
    // useAutoRefreshToken(userState.isLoggedIn ? logout : null);
    useAutoRefreshToken();
    return null; // UI 요소는 렌더링하지 않음
};

export default App;
