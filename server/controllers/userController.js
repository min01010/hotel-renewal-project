const userService = require('../services/userService');
const axios = require("axios");
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.signup = async (req, res) => {
  try {
    const userData = req.body;

    // 사용자 생성(통합 로그인)
    const { showPopup, popupType, message, userUniqueId} = await userService.integratedLogin(userData, null, "local");
  
    // 팝업을 띄워야 하는 경우 처리
    if (showPopup) {
      return res.status(200).json({
        success: false,
        showPopup: true,
        popupType,
        message, // 팝업에 표시할 메시지
        userUniqueId, // 통합 대상의 user_unique_id
        localId: userData.id
      });
    }

    // 팝업이 필요 없는 경우 로그인 페이지로 이동
    return res.status(201).json({
      success: true,
      message: '회원가입에 성공하였습니다.',
    });

  } catch (error) {
    console.error("회원가입 에러:", error);
    return res.status(500).json({ success: false, message: "회원가입에 실패하였습니다." });
  }
};

// 로컬 회원가입 시 아이디 중복체크
exports.checkId = async (req, res) => {
  const { localId } = req.query;
  try {
    const is_exist = await userService.findUserById(localId);
    const userExists = is_exist !== null; // null이 아니면 true, null이면 false

    res.status(200).json({ success: true, userExists: userExists });
  } catch(error){
    console.error("아이디 중복 체크 에러:", error);
    return res.status(500).json({ success: false, message: "아이디 중복 체크에 실패하였습니다." });
  }
}

// 로컬 로그인 코드
exports.login = async (req, res) => {
  const { localId, password } = req.body;

  try {
    const result = await userService.authenticateUser(localId, password); // 사용자 인증

    if (!result.success) {
      return res.status(200).json({ success: false, message: result.message });
    }
    
    const { user, userExist } = result;
    // Access Token 생성
    // jwt.sign()을 사용하여 비밀 키를 사용해 서명된 JWT를 생성
    const accessToken = jwt.sign(
      { id: user.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // Refresh Token 생성
    const refreshToken = jwt.sign(
      { id: user.id }, // payload
      REFRESH_TOKEN_SECRET, // 비밀키
      { expiresIn: '7d' }
    );

    // Refresh Token을 DB에 저장
    await userService.saveRefreshToken(user.id, refreshToken);

    // Refresh Token을 HTTP-Only Cookie로 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // JavaScript로 접근 불가
      // secure: true, // HTTPS에서만 작동
      secure: false,
      // sameSite: 'Strict', // CSRF 공격 방지
      //sameSite: 'None', // 다른 도메인에서 요청 시 쿠키 전송을 허용
      SameSite: 'Lax',
    });
    
    res.status(200).json({
      success: true,
      accessToken, // 액세스 토큰만 클라이언트로 반환
      user: {
        id: userExist.user_unique_id,
        user_name: userExist.name, // 필요한 필드만 포함
      },
    });
  } catch (error) {
    console.error("로컬 로그인 에러:", error);
    return res.status(500).json({ success: false, message: "로그인에 실패하였습니다." });
  }
};
// 로그아웃 코드
exports.logout = async (req, res) => {
  try {
    const { user_unique_id, method } = req.body;
    let value = user_unique_id;
    
    if(method === 'local') {
      const { refreshToken } = req.cookies; // 클라이언트로부터 리프레시 토큰 가져오기
      value = refreshToken;
      
      if (!refreshToken) {
          return res.status(400).json({ success: false, message: "리프레시 토큰이 존재하지 않습니다." });
      }
      // 클라이언트 쿠키에서 리프레시 토큰 제거
      res.clearCookie("refreshToken");
    } else {
      if (!user_unique_id) {
        return res.status(400).json({ success: false, message: "사용자 ID가 제공되지 않았습니다." });
      }
    }
    // 리프레시 토큰 db에서 삭제
    await userService.deleteRefreshToken(value, method);
    return res.status(200).json({ success: true, message: "로그아웃에 성공하였습니다." });
  } catch (error) {
    console.error("로그아웃 에러: ", error);
    return res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};
  
// 네이버 로그인 핸들러
exports.naverLogin = async (req, res) => {
  console.log("네이버 로그인 핸들러 실행");

  try {
    const { code, state } = req.body;  // 프론트엔드에서 받은 인증 코드와 상태 // 서버 세션에 저장된 상태 값

    if (state !== req.session.state) {
      return res.status(400).json({ success: false, message: "CSRF 검증 실패: state 값이 일치하지 않습니다." });
    }

    // 인증 코드로 액세스 토큰과 리프레시 토큰 요청
    const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',  // Authorization Code Grant
        client_id: process.env.NAVER_CLIENT_ID,  // 네이버 개발자 센터에서 발급받은 클라이언트 ID
        client_secret: process.env.NAVER_CLIENT_SECRET,  // 네이버 개발자 센터에서 발급받은 클라이언트 시크릿
        code: code,  // 프론트엔드에서 받은 인증 코드
        state: state,  // CSRF 보호를 위한 상태 값
      }
    });

    if (tokenResponse.data.error) {
      return res.status(400).json({
        success: false,
        message: `토큰 발급 실패: ${tokenResponse.data.error_description || tokenResponse.data.error}`
      });
    }

    const { access_token, refresh_token } = tokenResponse.data;

    //console.log('tokenResponse.data:',tokenResponse.data);
    //console.log('Access Token:', access_token);
    //console.log('Refresh Token:', refresh_token);

    // 네이버 API로 사용자 정보 요청
    const naverResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: {
          Authorization: `Bearer ${access_token}`, // 위에서 얻은 액세스토큰을 사용하여 사용자 정보 요청
      },
    });

    if (naverResponse.data.resultcode !== "00") {
      return res.status(400).json({
        success: false,
        message: "네이버 사용자 정보 요청 실패",
        detail: naverResponse.data.message
      });
    }
    const naverUserInfo = naverResponse.data.response;
    
    // 사용자 정보 저장/확인 (예: 데이터베이스에 저장)
    const { showPopup, popupType, message, userUniqueId, userExist } = await userService.integratedLogin(naverUserInfo, refresh_token, "naver");

     // 4. 팝업을 띄워야 하는 경우 처리
    if (showPopup) {
      return res.status(200).json({
        success: false,
        showPopup: true,
        popupType,
        message, // 팝업에 표시할 메시지
        userUniqueId, // 통합 대상의 user_unique_id
        naverId: naverUserInfo.id
      });
    };

    // 5. 팝업이 필요 없는 경우 정상 로그인 응답
    return res.status(200).json({
      success: true,
      user: {
        id: userExist.user_unique_id,
        user_name: userExist.name,
      },
      access_token,
    });
  } catch (error) {
    console.error("네이버 로그인 중 에러:", error);
    res.status(500).json({ success: false, message: "로그인 처리 중 에러 발생하였습니다." });
  }
};

exports.kakaoLogin = async (req, res) => {
  const { code, state } = req.body; // 클라이언트에서 받은 인증 코드와 상태 값
  
  try {
    // 세션에서 저장한 state 값 가져오기
    const sessionState = req.session.state;

    // state 값 검증
    if (state !== sessionState) {
      return res.status(400).json({ success: false, message: "잘못된 state 값입니다." });
    }

    // 1. 카카오에서 액세스 토큰 및 리프레시 토큰 발급 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_CLIENT_ID, // 카카오 REST API 키
        redirect_uri: process.env.KAKAO_REDIRECT_URI, // 리다이렉트 URI
        code,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (tokenResponse.data.error_code) {
      return res.status(400).json({
        success: false,
        message: `토큰 발급 실패: ${tokenResponse.data.error_description || tokenResponse.data.error_code}`
      });
    }

    const { access_token, refresh_token } = tokenResponse.data;

    // 2. 카카오 API로 사용자 정보 요청
    const kakaoResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const phone_number = '01097919391';
    const { id, properties } = kakaoResponse.data;
    const nickname = properties?.nickname;

    const userInfo = {
      id: id,
      name: nickname,
      email: `${nickname}@kakao.com`,
      mobile: phone_number
    };
    // 3. 사용자 정보 저장/갱신
    // user테이블에 같은 핸드폰번호 사용자가있는지 체크, 있으면 local_auth테이블에 같은 user_unique_id가 있는지 체크, 있으면 팝업 없으면 사용자 정보 저장
    const { showPopup, popupType, message, userUniqueId, userExist } = await userService.integratedLogin(userInfo, refresh_token, 'kakao');

    // 4. 팝업을 띄워야 하는 경우 처리
    if (showPopup) {
      return res.status(200).json({
        success: false,
        showPopup: true,
        popupType,
        message, // 팝업에 표시할 메시지
        userUniqueId, // 통합 대상의 user_unique_id
        kakaoId: id
      });
    }

    // 5. 팝업이 필요 없는 경우 정상 로그인 응답
    return res.status(200).json({
      success: true,
      user: {
        id: userExist.user_unique_id,
        user_name: userExist.name,
      },
      access_token,
    });
  } catch (error) {
    console.error("카카오 로그인 중 에러:", error); 
    res.status(500).json({ success: false, message: "로그인 처리 중 에러가 발생하였습니다." });
  }
};

// 통합 회원 요청 수락 처리
exports.acceptIntegration = async (req, res) => {
  const { userUniqueId, id, method, password, username} = req.body;
  try {
    // 서비스 호출
    const result = await userService.saveAcceptIntegration(userUniqueId, id, method, password, username);
    // 에러 메시지 반환
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    // 성공 응답 반환
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error("통합 처리 중 에러:", error);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다." });
  }
};

// 새 엑세스 토큰 발급(네이버)
exports.refreshNaverToken = async (req, res) => {
  try {
    const { user_unique_id, method } = req.body;
    const refreshToken = await userService.getRefreshToken(user_unique_id, method);

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "유효하지 않은 리프레시 토큰입니다." });
    }

    const tokenResponse = await axios.post("https://nid.naver.com/oauth2.0/token", null, {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.NAVER_CLIENT_ID,  // 네이버 개발자 센터에서 발급받은 클라이언트 ID
        client_secret: process.env.NAVER_CLIENT_SECRET,  // 네이버 개발자 센터에서 발급받은 클라이언트 시크릿
        refresh_token: refreshToken.refresh_token,
      },
    });

    if (tokenResponse.data.error) {
      return res.status(400).json({
        success: false,
        message: `새 토큰 발급 실패: ${tokenResponse.data.error_description || tokenResponse.data.error}`
      });
    }

    const { access_token, expires_in } = tokenResponse.data;

    // 클라이언트에 새로운 액세스 토큰 전달
    res.status(200).json({
      success: true,
      access_token,
      expires_in,
    });
  } catch (error) {
    console.error("토큰 갱신 중 에러:", error);
    res.status(500).json({ success: false, error: "토큰 갱신 중 에러가 발생하였습니다." });
  }
};

exports.refreshKakaoToken = async (req, res) => {
  try {
    const { user_unique_id } = req.body;

    // 사용자 데이터에서 리프레시 토큰 가져오기
    const refreshToken = await userService.getRefreshToken(user_unique_id, "kakao");
    
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "유효하지 않은 리프레시 토큰입니다." });
    }

    // 카카오 API로 액세스 토큰 갱신 요청
    // 카카오측에서 리프레시토큰 유효기간 만료 임박 시 리프레시 토큰 재발급 (db에 갱신하지 않고 다음 루틴에 로그아웃되도록 개발)
    const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.KAKAO_CLIENT_ID, // 카카오 REST API 키
        refresh_token: refreshToken.refresh_token,
      },
    });
    
    if (tokenResponse.data.error_code) {
      return res.status(400).json({
        success: false,
        message: `새 토큰 발급 실패: ${tokenResponse.data.error_description || tokenResponse.data.error_code}`
      });
    }

    const { access_token, expires_in, refresh_token } = tokenResponse.data;

    if (refresh_token) {
      console.log("새로운 리프레시 토큰이 발급:", refresh_token);
      // await userService.UpdateRefreshToken(user_unique_id, refresh_token, "kakao");
    } else {
      console.log("리프레시 토큰은 갱신되지 않았습니다.");
    }

    // 클라이언트에 새로운 액세스 토큰 전달
    res.status(200).json({
      success: true,
      access_token,
      expires_in,
    });
  } catch (error) {
    console.error("토큰 갱신 중 에러:", error);
    res.status(500).json({ success: false, message: "카카오 토큰 갱신 중 에러가 발생하였습니다." });
  }
};

// refresh token 검증하는 코드 
exports.validateRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // httpOnly 쿠키에서 리프레시 토큰 가져오기
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "쿠키에서 리프레시 토큰을 가져오지 못했습니다." });
    }
    // 리프레시 토큰 검증(검증 시 에러나면 바로 catch로 이동)
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 디코딩된 정보 활용 (예: 사용자 ID를 로그에 남기기)
    //console.log(`Refresh token valid for user ID: ${decoded.id}`);

    // 유효한 리프레시 토큰이면 success: true 반환
    return res.status(200).json({ success: true, message: "리프레시 토큰이 유효합니다."});
  } catch (error) {
    console.error("리프레시 토큰 검증 에러: ", error);
    // 토큰이 만료되었거나 유효하지 않은 경우 success: false 반환
    return res.status(500).json({ success: false, message: "리프레시 토큰이 존재하지않거나 유효하지 않습니다." });
  }
};

// 사용자 인증 후 로컬 access token 갱신하는 코드(위의 validateRefreshToken 함수 실행 후 성공시 실행되는 함수 (useFetchWithToken))
exports.refreshToken = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, message: "user_id가 없습니다." });
  }
  try {
    // 새로운 Access Token 생성
    const newAccessToken = jwt.sign(
      { id: user_id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' } // 엑세스 토큰 만료 시간 설정
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
    
  } catch (error) {
    console.error("액세스 토큰 갱신 에러:", error);
    res.status(500).json({ success: false, message: '엑세스 토큰 갱신에 실패하였습니다.' });
  }
};

// SNS 로그인 요청 시 서버 세션에 state 저장
exports.setAuthState = async (req, res) => {
  const { storedState } = req.body;
  try {
    if (!storedState || typeof storedState !== 'string') {
      return res.status(400).json({ success: false, message: '유효하지 않은 state 값입니다.' });
    }
    if (!req.session) {
      return res.status(500).json({ success: false, message: '세션이 설정되지 않았습니다.' });
    }

    // 서버 세션에 state 값을 저장
    req.session.state = storedState;

    // 성공 응답 반환
    return res.status(200).json({ success: true, message: 'State가 저장되었습니다.' });
  } catch (error) {
    console.error("세션 저장 중 에러:", error);

    // 에러 메시지 반환
    return res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 마이페이지 - 회원 탈퇴
exports.withdraw = async (req, res) => {
  try {
    const { user_unique_id } = req.body;

    if (!user_unique_id) {
      return res.status(400).json({ success: false, message: "유효하지 않은 사용자 정보입니다." });
    }

    // 회원 삭제
    await userService.deleteUser(user_unique_id);
    const deleteResult = await userService.deleteUser(user_unique_id);

    if (!deleteResult.success) {
      return res.status(404).json({ success: false, message: "이미 탈퇴된 사용자이거나 존재하지 않습니다." });
    }
    //res.clearCookie("refreshToken");
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return res.status(200).json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("회원 탈퇴 에러:", error);
    return res.status(500).json({ success: false, message: "서버 에러로 인해 탈퇴할 수 없습니다." });
  }
};

// 마이페이지 - 비밀번호 변경
exports.updateUserPassword = async (req, res) => {
  try {
    const { user_unique_id, current_password, new_password } = req.body;

    // 비밀번호 변경 서비스 호출
    const response = await userService.modifyUserPassword(user_unique_id, current_password, new_password);

    if (!response.success) {
        return res.status(400).json({ success: false, data: { message: response.message } });
    }
    return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 회원 정보 조회
exports.getUserInfo = async (req, res) => {
  try {
    const { user_unique_id } = req.query; // GET 방식으로 user_unique_id 전달

    if (!user_unique_id) {
      return res.status(400).json({ success: false, message: "유효하지 않은 사용자 정보입니다." });
    }

    const userInfo = await userService.fetchUserInfo(user_unique_id);
    if (!userInfo.success) {
      return res.status(404).json({ success: false, message: userInfo.message });
    }

    return res.status(200).json({ success: true, data: userInfo.data });
  } catch (error) {
    console.error("사용자 정보 조회 에러: ", error);
    return res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 객실예약 옵션 선택 회원정보조회
exports.getReservUserInfo = async (req, res) => {
  try {
    const { user_unique_id } = req.query; // GET 방식으로 user_unique_id 전달

    if (!user_unique_id) {
      return res.status(400).json({ success: false, message: "유효하지 않은 사용자 정보입니다." });
    }

    const userInfo = await userService.fetchReservUserInfo(user_unique_id);
    if (!userInfo.success) {
      return res.status(404).json({ success: false, message: userInfo.message });
    }

    return res.status(200).json({ success: true, data: userInfo.data });
  } catch (error) {
    console.error("사용자 정보 조회 에러: ", error);
    return res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};


// 회원정보 수정
exports.updateUserInfo = async (req, res) => {
  try {
    const { user_unique_id, name, phone, email } = req.body;
    // 회원정보 수정 서비스 호출
    const response = await userService.modifyUserInfo(user_unique_id, name, phone, email);
    
    if (!response.success) { //회원정보 중복
      return res.status(409).json({ success: false, message: response.message });
    }
    return res.status(200).json({ success: true, message: "회원정보가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("회원정보 수정 실패: ", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 위시리스트 추가 API
exports.createUserWishlist = async (req, res) => {
  try {
    const { user_unique_id, room_id } = req.body;  // 요청 바디에서 데이터 추출

    const response = await userService.saveUserWishlist(user_unique_id, room_id);

    if (!response.success) {
      return res.status(400).json({ success: false, message: response.message });
    }

    return res.status(200).json({ success: true, message: "위시리스트에 추가되었습니다." });
  } catch (error) {
    console.error("위시리스트 추가 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 위시리스트 추가여부 조회 API
exports.checkIfLiked = async (req, res) => {
  try {
    const { userId, roomId } = req.query;  // 쿼리 파라미터로 사용자 ID와 객실 ID를 받음
    
    if (!userId || !roomId) {
      return res.status(400).json({ success: false, message: "사용자 ID 또는 객실 ID가 존재하지 않습니다." });
    }

    const result = await userService.isRoomInWishlist(userId, roomId);  // 사용자 ID와 객실 ID로 위시리스트 확인
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("위시리스트 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 위시리스트 조회 API
exports.getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ success: false, message: "사용자 ID가 존재하지 않습니다." });
    }

    const result = await userService.fetchUserWishlist(userId);  // 사용자 ID와 객실 ID로 위시리스트 확인
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("위시리스트 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 위시리스트 아이템 삭제 API
exports.deleteUserWishlist = async (req, res) => {
  try {
    const { user_unique_id, room_id } = req.body;  // 요청 바디에서 `wishlistId`와 `userId`를 받아 처리
    if (!user_unique_id || !room_id) {
      return res.status(400).json({ success: false, message: "위시리스트 ID 또는 사용자 ID가 존재하지 않습니다." });
    }

    const result = await userService.removeUserWishlist(user_unique_id, room_id);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    
    return res.status(200).json({success: true, message: result.message});
  } catch (error) {
    console.error("위시리스트 삭제 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 약관 정보 가져오기 (필수/선택 구분)
exports.getTerms = async (req, res) => {
  try {
    const termsData = await userService.fetchTerms();  // 서비스에서 약관 정보를 가져옴
    if (!termsData.success) {
      return res.status(404).json({ success: false, message: termsData.message });
    }
    return res.status(200).json({ success: true, terms: termsData.terms });  // 성공 시 약관 정보 반환
  } catch (error) {
    console.error("약관 정보 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 사용자가 동의한 약관 저장하기
exports.agreeTerms = async (req, res) => {
  const { userId, terms } = req.body;

  // 필수 필드 확인
  if (!userId || !terms) {
    return res.status(400).json({ success: false, message: "사용자 ID 또는 약관 동의 정보가 존재하지 않습니다." });
  }

  try {
    const result = await userService.saveAgreeTerms(userId, terms);  // 약관 동의 처리
    
    return res.status(200).json({success: true, message: result.message});
  } catch (error) {
    console.error("약관 동의 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};
