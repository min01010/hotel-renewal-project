// src/components/FileUpload.js
import React, { useState } from 'react';
import { storage } from '../utils/firebase';  // Firebase 초기화 파일 import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const FileUpload = () => {
  const [image, setImage] = useState(null); // 선택한 이미지 상태
  const [progress, setProgress] = useState(0); // 업로드 진행 상태
  const [url, setUrl] = useState(''); // 업로드된 이미지 URL 상태

  // 파일 선택 핸들러
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // 이미지 업로드 핸들러
  const handleUpload = () => {
    if (!image) {
      alert("파일을 선택하세요.");
      return;
    }

    // Firebase Storage에 업로드할 참조 생성
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // 진행률 계산
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress); // 진행 상태 업데이트
      },
      (error) => {
        console.log("업로드 중 오류 발생:", error); // 에러 처리
      },
      () => {
        // 업로드 완료 후 다운로드 URL 가져오기
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL); // 상태 업데이트
          console.log("파일 다운로드 URL:", downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />  {/* 파일 선택 */}
      <button onClick={handleUpload}>업로드</button>  {/* 업로드 버튼 */}
      <progress value={progress} max="100" />  {/* 업로드 진행률 표시 */}
      <br />
      {url && <img src={url} alt="업로드한 이미지" width="200" />}  {/* 업로드된 이미지 출력 */}
    </div>
  );
};

export default FileUpload;
