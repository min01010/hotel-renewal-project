import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isMainPage = location.pathname === "/"; // 메인 페이지 확인

  useEffect(() => {
    if (isMainPage) {
      document.body.style.overflow = "hidden"; // 메인에서 외부 스크롤 제거
    } else {
      document.body.style.overflow = "auto"; // 다른 페이지에서는 원래대로
    }

    return () => {
      document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 복구
    };
  }, [isMainPage]);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!isMainPage && <Footer />} {/* 메인 페이지가 아닐 때만 푸터 표시 */}
    </>
  );
};

export default Layout;
