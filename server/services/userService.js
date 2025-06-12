const User = require('../models/users');
const LocalAuth = require('../models/local_auth');
const NaverAuth = require('../models/naver_auth');
const KakaoAuth = require('../models/kakao_auth');
const Wishlist = require('../models/wishlists');
const Room = require('../models/rooms');
const Term = require('../models/terms');
const ReservationTerm = require('../models/reservation_terms')
const Image = require('../models/images');

const bcryptUtil = require('../utils/bcryptUtil');
const bcrypt = require('bcrypt');

// Refresh Token 저장
exports.saveRefreshToken = async (id, refreshToken) => {
    try {
        // local_auth 테이블에서 userId에 해당하는 항목 찾기
        const localAuth = await LocalAuth.findOne({ where: { id: id } });

        if (!localAuth) {
            throw new Error('로컬 테이블에서 해당 유저가 존재하지 않습니다.');
        }

        // 해당 localAuth에 refreshToken 저장
        localAuth.refresh_token = refreshToken;
        await localAuth.save();  // 저장

        console.log('리프레시 토큰이 저장되었습니다.');
    } catch (error) {
        console.error("리프레시 토큰 저장 에러 발생:", error);
        throw new Error("리프레시 토큰 저장 에러가 발생하였습니다.");
    }
};
// 리프레시 토큰 조회 함수 (SNS)
exports.getRefreshToken = async (user_unique_id, method) => {
    try {
        const AuthModel =  (method === 'naver' ? NaverAuth : KakaoAuth);
        return AuthModel.findOne({
            where: { user_unique_id: user_unique_id },
            attributes: ['refresh_token']  // 필요한 컬럼만 지정
        });
    } catch (error) {
        console.error("리프레시 토큰 조회 중 에러 발생:", error);
        throw new Error("리프레시 토큰 조회 중 에러가 발생하였습니다.");
    }
};

// 리프레시 토큰 삭제 함수
exports.deleteRefreshToken = async (value, method) => {
    try {
        // method가 naver: NaverAuth, method가 kakao: KakaoAuth, 둘다 아니면 기본적으로 LocalAuth가 선택
        const AuthModel = (
            method == 'naver' ? NaverAuth : 
            method == 'kakao' ? KakaoAuth :  LocalAuth);
        const whereCondition = {};

        // 조건을 동적으로 추가
        if (method != 'local') { // 네이버일때 user_unique_id로 유저 찾기
            whereCondition.user_unique_id = value;
        } else{
            whereCondition.refresh_Token = value;
        }

        const result = await AuthModel.update(
            { refresh_token: null }, // 리프레시 토큰을 null로 설정
            { where: whereCondition  } // 조건: user_unique_id or refresh_Token이 일치
        );
        
      if (result[0] == 0) {
        throw new Error("리프레시 토큰 삭제 실패: 해당 유저를 찾을 수 없습니다.");
      }
  
      console.log(`리프레시 토큰이 삭제되었습니다.`);
      return true;
    } catch (error) {
      console.error("리프레시 토큰 삭제 중 에러 발생:", error);
      throw new error("리프레시 토큰 삭제 중 에러가 발생하였습니다.");
    }
  };
// 로컬 회원가입시에 아이디 중복체크
exports.findUserById = async (localId) => {
    try {
        const findLocalId = LocalAuth.findOne({
            where: { local_id: localId }
        });
        return findLocalId; 
    } catch (error) {
        console.error("아이디 중복 체크 에러 발생:", error);
        throw new Error("아이디 중복 체크 중 에러가 발생하였습니다.");
    }
};
  
// 사용자 인증 함수 (로컬 로그인시에 아이디, 비밀번호가 테이블에 저장된 정보와 일치하는지 확인)
exports.authenticateUser = async (localId, password) => {
    try {
        // 데이터베이스에서 사용자 조회
        const user = await LocalAuth.findOne({ where: { local_id: localId } });

        if (!user) {
            return { success: false, message: "아이디가 일치하지 않습니다."};
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "비밀번호가 일치하지 않습니다."};
        }
        let userExist = await User.findOne({ where: { user_unique_id: user.user_unique_id } }); 
        
        return { 
            success: true,
            user: user, 
            userExist: userExist 
        }; // 인증 성공 시 user 객체 반환
    } catch (error) {
        console.error("사용자 인증 에러 발생: ", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 통합로그인 처리
exports.integratedLogin = async (userInfo, refresh_token, method) => {
    try {
        let { id, name, email, mobile, password } = userInfo; // password는 local로그인에서만 넘겨줌. 나머지 방식은 undefined 반환(에러x)
        if(method == 'naver') mobile = mobile.replace(/-/g, "");  // 정규식을 사용하여 '-'를 제거

        const AuthModel = (
            method === 'naver' ? NaverAuth : 
            method === 'kakao' ? KakaoAuth :  LocalAuth);

        // 휴대폰 번호로 user테이블에 회원 존재하는지 체크 후 존재 시 user_unique_id로 어느 테이블에 회원존재하는지 확인
        // user테이블에 휴대폰 번호 존재x(아예 처음 가입): 휴대폰 번호가 undefined이므로 변수 user에서 user_unique_id로 찾기 불가능.
        // userExist?를 사용하여, userExist가 null/undefined일 경우(처음 가입) user에서 찾을때 에러 발생하지않도록 조치(에러 안나고 undefined 반환됨.)
        let userExist = await User.findOne({ where: { phone_number: mobile } }); 
        let user = null;
        // if (userExist) {
        //     user = await AuthModel.findOne({ where: { user_unique_id: userExist.dataValues.user_unique_id } });
        // }

        if (userExist) { // user 테이블에 사용자가 존재하는 경우 
            user = await AuthModel.findOne({ where: { user_unique_id: userExist.dataValues.user_unique_id } });

            if(user){ // (카카오/네이버/로컬) 정보 있는 경우(내가 로그인한 방식으로 회원정보 존재하는 경우)
                if(AuthModel === LocalAuth){ // 로컬 회원 존재하는데 로컬 회원가입 시도 시
                    return {
                        showPopup: true,
                        popupType: 'success', // 팝업 종류 (e.g., 'error', 'success', 'info')
                        message: '이미 일반회원으로 가입된 번호입니다. 로그인 페이지로 이동합니다.',
                        userUniqueId: userExist.user_unique_id,
                    };
                } else{ // 카카오/네이버 정보 존재하는 경우(내가 로그인한 방식으로 존재하는 경우)
                    await AuthModel.update(
                    { refresh_token: refresh_token },
                    { where: { user_unique_id: userExist.user_unique_id } }, 
                    );
                }
            } else{ // 내가 로그인한 방식 외 테이블에 회원정보 존재하는 경우
                return {
                    showPopup: true,
                    popupType: 'info', 
                    message: '이미 가입된 번호입니다. 통합 하시겠습니까?',
                    userUniqueId: userExist.user_unique_id,
                };
            }
        } else { // 새 사용자 생성 로직(user테이블에 사용자 존재 x)
                // 010 뒤에 8자리 랜덤 숫자 생성(카카오)
                // if(method == 'kakao'){
                //     const generateRandomPhone = () => {
                //         const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8자리 랜덤 숫자
                //         return `010${randomDigits}`;
                //     };
                // }
                
            // User 테이블에 사용자 생성
            user = await User.create({
                email: email,
                name: name,
                phone_number: mobile, // 랜덤 전화번호 추가
            });
            // 내가 로그인한 방식 테이블에 사용자 생성
            const authData = {
                user_unique_id: user.user_unique_id,
                [`${method}_id`]: id,
                refresh_token: refresh_token,
            };
            // AuthModel이 LocalAuth 모델일 때만 username과 password 추가
            if (AuthModel === LocalAuth) {
                // 비밀번호 암호화
                const hashedPassword = await bcryptUtil.hashPassword(password);
                authData.username = name; // LocalAuth 모델에만 username 추가
                authData.password = hashedPassword; // LocalAuth 모델에만 password 추가
            }
            // 최종적으로 AuthModel에 데이터 생성
            await AuthModel.create(authData);
            userExist = await User.findOne({ where: { phone_number: mobile } });
        }
        return { userExist, showPopup: false };
    } catch (error) {
        console.error("통합 로그인 중 에러 발생:", error);
        throw new Error("통합 로그인 중 에러가 발생하였습니다.");
    }
};

// 통합회원 요청 수락 처리 서비스
exports.saveAcceptIntegration = async (userUniqueId, id, method, password, username) => {
    try {
        if (!userUniqueId) {
            return { success: false, message: "통합 처리 중 에러가 발생하였습니다." };
        }
        const AuthModel = (
            method == 'naver' ? NaverAuth : 
            method == 'kakao' ? KakaoAuth :  LocalAuth);
    
        if(AuthModel == LocalAuth){
            // 비밀번호 암호화
            const hashedPassword = await bcryptUtil.hashPassword(password);
    
            await LocalAuth.create({
                user_unique_id: userUniqueId,
                // 계산된 객체 속성명: 객체의 속성명을 동적으로 정의가능
                [`${method}_id`]: id, // method에 따라 "kakao_id", "naver_id" 등 동적 생성
                username: username,
                password: hashedPassword
              });
        } else{
            // 계정 데이터 추가 (기존 회원가입 이력 있는 경우)
            await AuthModel.create({
                user_unique_id: userUniqueId,
                // 계산된 객체 속성명: 객체의 속성명을 동적으로 정의가능
                [`${method}_id`]: id, // method에 따라 "kakao_id", "naver_id" 등 동적 생성
            });
        }
        return { success: true, message: "통합 요청에 성공하였습니다." };
    } catch (error) {
        console.error("통합 로그인 에러 발생:", error);
        throw new Error("통합 로그인 처리 중 에러가 발생하였습니다.");
    }
  };

// 회원 삭제
exports.deleteUser = async (user_unique_id) => {
    try {
      await User.destroy({ where: { user_unique_id } });
  
      console.log(`회원 ${user_unique_id} 삭제 완료`);
      return { success: true, message: "회원 ${user_unique_id} 삭제가 완료되었습니다." };
    } catch (error) {
      console.error("회원 삭제 중 에러 발생: ", error);
      throw new Error("회원 삭제 중 에러가 발생하였습니다.");
    }
};

exports.modifyUserPassword = async (user_unique_id, current_password, new_password) => {
    try {
        // 사용자 조회
        const user = await LocalAuth.findOne({ where: { user_unique_id } });
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }
        // 기존 비밀번호 확인
        const isMatch = await bcrypt.compare(current_password, user.password);

        if (!isMatch) {
            return { success: false, message: "기존 비밀번호가 일치하지 않습니다." };
        }
        // 새 비밀번호 해싱 후 업데이트
        const hashedPassword = await bcryptUtil.hashPassword(new_password);
        const [affectedRows] = await LocalAuth.update({ password: hashedPassword }, { where: { user_unique_id } });
        
        if (affectedRows === 0) {
            return { success: false, message: "비밀번호 변경에 실패했습니다." };
        }
        return { success: true, message: "비밀번호가 변경되었습니다." };
    } catch (error) {
        console.error("비밀번호 변경 에러: ", error);
        throw new Error("서버 에러가 발생했습니다.");
    }
};
// 회원 정보 조회
exports.fetchUserInfo = async (user_unique_id) => {
    try {
        const user = await User.findOne({
            where: { user_unique_id },
            attributes: ["name", "phone_number", "email"],
            include: [{
              model: LocalAuth,
              as: "localAuth",
              attributes: ["local_id"],
            }]
        });
        if (!user || !user.localAuth) {
            return {
                success: false,
                message: "해당 사용자의 정보를 찾을 수 없습니다."
            };
        }

        return {
            success: true,
            data: {
                localId: user.localAuth.local_id,
                name: user.name,
                phone: user.phone_number,
                email: user.email,
            }
        };
    } catch (error) {
        console.error("사용자 정보 조회 에러: ", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 객실예약 옵션 선택 회원정보조회
exports.fetchReservUserInfo = async (user_unique_id) => {
    try {
        const user = await User.findOne({
            where: { user_unique_id },
            attributes: ["name", "phone_number", "email"],
        });
        if (!user) {
            return {
                success: false,
                message: "해당 사용자의 정보를 찾을 수 없습니다."
            };
        }
        return {
            success: true,
            data: {
                name: user.name,
                phone: user.phone_number,
                email: user.email,
            }
        };
    } catch (error) {
        console.error("사용자 정보 조회 에러: ", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 회원정보 수정
exports.modifyUserInfo = async (user_unique_id, name, phone, email) => {
    try {
        // 사용자 조회
        const user = await User.findOne({ where: { user_unique_id } });
        if (!user) {
            return { success: false, message: "사용자를 찾을 수 없습니다." };
        }
        if(user.phone_number !== phone){
            // 핸드폰번호 체크
            const phoneCheck = await User.findOne({ where: { phone_number: phone } });

            if (phoneCheck) {
                return { success: false, message: "동일 번호로 다른 계정이 존재합니다. 해당 계정 로그인 또는 관리자에게 문의해주세요." };
            }
        }
        // 회원정보 업데이트
        const [updateUser] = await User.update(
            { name, phone_number: phone, email },
            { where: { user_unique_id } }
        );
        if (updateUser === 0) {
            return { success: false, message: "회원정보 수정에 실패하였습니다." };
        }
        return { success: true, message: "회원정보 수정이 완료되었습니다." };
    } catch (error) {
        console.error("회원정보 수정 에러:", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 위시리스트 추가
exports.saveUserWishlist = async (user_unique_id, room_id) => {
    try {
      // 중복 체크: 이미 위시리스트에 있는지 확인
      const existingItem = await Wishlist.findOne({ where: { user_unique_id, room_id } });
      
      if (existingItem) {
        return { success: false, message: "이미 위시리스트에 추가된 객실입니다." };
      }
  
      // 위시리스트에 추가
      await Wishlist.create({ user_unique_id, room_id });
  
      return { success: true, message: "위시리스트에 추가되었습니다."};
    } catch (error) {
      console.error("위시리스트 추가 에러: ", error);
      throw new Error("서버 에러가 발생하였습니다.");
    }
  };
  
// 위시리스트 추가여부 조회(객실 페이지)
exports.isRoomInWishlist = async (userId, roomId) => {
    try {
        const wishlist = await Wishlist.findOne({
            where: { user_unique_id: userId, room_id: roomId },
        });
        if (wishlist) {
            return { success: true, isWishlisted: true };
        }
        return { success: true, isWishlisted: false };
    } catch (error) {
        console.error("위시리스트 조회 실패: ", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 마이페이지 - 위시리스트 조회
exports.fetchUserWishlist = async (userId) => {
    try {
        const wishlist = await Wishlist.findAll({
            where: { user_unique_id: userId },
            include: [
                {
                  model: Room,
                  as: 'room',
                  attributes: ['room_type','title'], // 룸타입만 가져오기
                  include: [
                    {
                      model: Image,
                      attributes: ['image_url'],
                      required: false,
                      where: { entity_type: 'room' },
                    }
                  ]
                }
            ]
        });
        return { success: true, wishlist: wishlist };
    } catch (error) {
        console.error("위시리스트 조회 실패:", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
}
// 위시리스트 객실정보, 위시리스트정보 가져오기(이미지 없이)
// exports.fetchUserWishlist = async (userId) => {
//     try {
//         const wishlist = await Wishlist.findAll({
//             where: { user_unique_id: userId },
//             include: [
//                 {
//                   model: Image,
//                   attributes: ['image_url'],
//                   required: false,
//                   where: { entity_type: 'room' },
//                 }
//               ]
//         });

//         if (!wishlist) {
//             console.log("위시리스트가 없습니다.");
//             return { success: false, message: "위시리스트가 존재하지 않습니다." };
//         }

//         const roomDetails = [];

//         // room_id가 존재하는지 확인
//         for (const item of wishlist) {
//             if (!item.room_id) {
//                 console.log("room_id가 없습니다.");
//                 continue; // 해당 아이템은 건너뛰기
//             }

//             const roomType = await Room.findOne({
//                 where: { room_id: item.room_id },
//                 attributes: ['room_type', 'title', 'room_id'],  // 필요한 컬럼만 지정
//             });

//             if (!roomType) {
//                 console.log(`해당 room_id(${item.room_id})의 방 정보가 없습니다.`);
//                 continue;
//             }

//             roomDetails.push(roomType);  // 방 정보 저장
//         }

//         if (roomDetails.length === 0) {
//             return { success: false, message: "위시리스트에 유효한 방 정보가 없습니다." };
//         }

//         return { success: true, wishlist: roomDetails };
//     } catch (error) {
//         console.error("위시리스트 조회 실패:", error);
//         throw new Error("위시리스트를 가져오는 중 에러가 발생했습니다.");
//     }
// };


// 마이페이지 - 위시리스트 아이템 삭제
exports.removeUserWishlist = async (userId, roomId) => {
    try {
        const item = await Wishlist.findOne({
            where: { user_unique_id: userId, room_id: roomId },
        });

        if (!item) {
            return { success: false, message: "위시리스트 항목을 찾을 수 없습니다." };
        }

        await item.destroy();
        return { success: true, message: "위시리스트가 삭제되었습니다." };
    } catch (error) {
        console.error("위시리스트 삭제 실패: ", error);
        throw new Error("서버 에러가 발생하였습니다.");
    }
};

// 약관 정보 가져오기 (필수/선택 구분)
exports.fetchTerms = async () => {
    try {
      const terms = await Term.findAll();  // 모델을 사용하여 모든 약관 가져오기
      if(!terms) {
        return { success: false, message: "약관을 찾을 수 없습니다." };
      }
      return { success: true, terms: terms };
    } catch (error) {
      console.error("약관 정보를 가져오는 데 실패했습니다:", error);
      throw new Error("약관 정보를 가져오는 데 에러가 발생하였습니다.");
    }
};
  
// 사용자가 동의한 약관 저장하기
exports.saveAgreeTerms = async (reservationId, terms) => {
    try {
        // 약관 동의 기록을 user_terms 테이블에 삽입
        for (let termId in terms) {
            const isAgreed = terms[termId];
            await ReservationTerm.create({
                reservation_id: reservationId,
                term_id: termId,
                is_agreed: isAgreed,
            });
        }
        return { success: true, message: "약관 동의 처리가 완료되었습니다." };
    } catch (error) {
        console.error("약관 동의 처리 중 에러 발생:", error);
        throw new Error("약관 동의 처리 중 에러가 발생하였습니다.");
    }
};