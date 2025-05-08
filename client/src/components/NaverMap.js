import React, { useEffect } from "react";

const NaverMap = () => {
  useEffect(() => {
    // 네이버 지도 API 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=tmp4r69aid`;
//LG9dV2kcL7F51NeGyvs9S6N99tnkrQlvkY6uEHf7
    script.async = true;
    script.onload = () => {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.508737, 127.064213),
        zoom: 15,
      });

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.508737, 127.064213),
        map,
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: "100%", height: "100%", display: "block" }}></div>;
};

export default NaverMap;
