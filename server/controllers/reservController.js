const reservService = require('../services/reservService');

exports.getAvailableRooms = async (req, res) => {
  const { startDate, endDate, rooms } = req.body;

  try {
    // 예약 조건에 맞는 객실 정보와 가격 가져오기
    const reservationData = await reservService.fetchAvailableRooms(startDate, endDate, rooms);

    if (!reservationData.success) {
      return res.status(200).json({ success: false, message: "예약 가능한 객실이 없습니다."});
    }
    return res.status(200).json({
      success: true,
      availableReservations: reservationData.availableRoomDetails, // 프론트엔드에서 요구하는 형식
    });
    
  } catch (error) {
    console.error('예약 검색 에러:', error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 예약 내역 추가
exports.createUserReservation = async (req, res) => {
  const { reservations } = req.body;
  const { user_unique_id, room_id, rooms, check_in_date, check_out_date, total_price, termsAgreement, imp_uid, merchant_uid, pay_method ,pg_provider, pg_tid} = reservations;

  try {
    // 예약 생성
    const reservationIdsData = await reservService.saveUserReservation(user_unique_id, room_id, rooms, check_in_date, check_out_date, total_price, imp_uid, merchant_uid, pay_method ,pg_provider, pg_tid);

    // 약관 동의 정보 저장
    if (termsAgreement) {
      await reservService.insertTermsAgreement(reservationIdsData.reservationIds, termsAgreement);
    }

    res.status(200).json({ success: true, message: '예약이 완료되었습니다.', reservation_id: reservationIdsData.reservationIds });
  } catch (error) {
    console.error('예약 처리 중 에러:', error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 예약 내역 불러오기
exports.getUserReservations = async (req, res) => {
  const { user_id } = req.query;
  try {
    const reservations = await reservService.fetchUserReservations(user_id);
    if (!reservations.success) {
      return res.status(404).json({ success: false, message: reservations.message });
    }
    const { reservationList } = reservations;
    const reservationData = reservationList.map(reservation => reservation.dataValues);
    res.status(200).json({ success: true, data: reservationData });
  } catch (error) {
    console.error("예약 내역 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 예약 취소
exports.deleteUserReservation = async (req, res) => {
  const { reservation_id } = req.body;

  try {
    const removeReservation = await reservService.removeUserReservation(reservation_id);

    if (!removeReservation.success) {
      return res.status(404).json({ success: false, message: removeReservation.message });
    }
    res.status(200).json({ success: true, message: removeReservation.message });
  } catch (error) {
    console.error("예약 취소 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};
