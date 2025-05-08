// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Storage 추가
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-G2hYgZWuvUT6I7FtnoUxo6ztNuLyUWI",
  authDomain: "hotel-cd8ab.firebaseapp.com",
  projectId: "hotel-cd8ab",
  storageBucket: "hotel-cd8ab.firebasestorage.app", // 잘못된 URL 수정
  messagingSenderId: "425289263134",
  appId: "1:425289263134:web:29abc501f6aa536568260f",
  measurementId: "G-SCPPZK0HGQ"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 가져오기
const auth = getAuth(app);
const storage = getStorage(app); // Storage 인스턴스 가져오기

export { auth, storage }; // storage 추가
