const Room = require('../models/rooms');
const RoomPrice = require('../models/room_prices');
const Reservation = require('../models/reservations');
const ReservationTerm = require('../models/reservation_terms');
const Image = require('../models/images');

const { Sequelize,Op , fn, col, literal} = require('sequelize');

exports.fetchAvailableRooms = async (startDate, endDate, rooms) => {
  try {
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split(".").map(item => item.trim().padStart(2, "0"));
      return `${year}-${month}-${day}`;
    };
    
    const formattedStartDate = parseDate(startDate);
    const formattedEndDate = parseDate(endDate);

    // 필요한 객실 타입별 요청 수 계산
    // 사용자가 설정한 객실갯수, 객실별 인원수 몇명인지 체크
    const roomRequests = {};
    rooms.forEach(room => {
      const capacityRequired = room.adults + room.children;
      if (!roomRequests[capacityRequired]) {
        roomRequests[capacityRequired] = 0;
      }
      roomRequests[capacityRequired] += 1;
    });
    // 3: 2,  // 3명 이상 수용 가능한 객실 2개 필요
    // 2: 1   // 2명 이상 수용 가능한 객실 1개 필요
    // 모든 객실 조회
    // Sequelize에서 include는 각 모델 간의 관계를 바탕으로 자동으로 SQL JOIN을 수행하여 데이터를 가져옴
    const { Op, Sequelize } = require("sequelize");
    const allRooms = await Room.findAll({
      attributes: [
        'room_id',
        'room_type',
        'capacity',
        'quantity',
        [
          Sequelize.literal(`
            quantity - COALESCE((
              SELECT COUNT(*) 
              FROM reservation res
              WHERE res.room_id = rooms.room_id
              AND (
                (res.check_in_date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}') 
                OR (res.check_out_date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}') 
                OR (res.check_in_date <= '${formattedStartDate}' AND res.check_out_date >= '${formattedEndDate}')
              )
            ), 0)
          `),
          'available_quantity'
        ]
      ],
      include: [
        {
          model: RoomPrice,
          as: 'roomPrice',
          attributes: ['price'],
          required: true, // JOIN을 강제 (INNER JOIN처럼 동작)
          where: {
            start_date: { [Op.lte]: formattedEndDate },
            end_date: { [Op.gte]: formattedStartDate }
          }
        },
        {
          model: Image,
          attributes: ['image_url'],
          required: false,
          where: { entity_type: 'room' },
          // limit: 1,
          // separate: true,
        }
      ],
      order: [[Sequelize.col('roomPrice.price'), 'ASC']],
      // raw: true, // JSON 형태로 변환
      nest: true // ✅중첩 구조 유지 (roomPrice가 배열이 아니라 객체로 변환됨)
    });
    
    if (!allRooms) {
      return { success: false, message: "예약가능한 객실 정보가 존재하지 않습니다." };
    }
    // 1. 룸 타입 필터링 (각 객실이 필요한 수용인원을 만족하는지 확인)
    const availableRooms = allRooms.filter(room => {
      let canAccommodate = true;
      // roomRequests의 각 인원 수 요구사항을 만족하는지 확인
      for (const [capacityRequired, count] of Object.entries(roomRequests)) {
        if (room.capacity < capacityRequired || room.available_quantity < count) {
          canAccommodate = false; // 조건을 만족하지 않으면 해당 객실은 제외
          break;
        }
      }

      return canAccommodate;
    });

    // 2. 예약 가능한 룸 타입과 가격, 수용인원 포함하여 반환
    const availableRoomDetails = availableRooms.map(room => ({
      room_id: room.room_id,
      room_type: room.room_type,
      price: room.roomPrice[0].price,
      capacity: room.capacity,
      image: room.Images[0].image_url,
    }));
    return { success: true, availableRoomDetails: availableRoomDetails};
    
  } catch (error) {
    console.error('예약 서비스 에러:', error);
    throw new Error('예약 정보 검색 중 에러가 발생했습니다.');
  }
};

const { v4: uuidv4 } = require("uuid");

exports.saveUserReservation = async (userUniqueId, roomId, rooms, checkInDate, checkOutDate, totalPrice, impUid, merchantUid, payMethod, pgProvider, pgTid) => {
  try {
    // 같은 예약에 대해 동일한 UUID 생성
    const reservationNumber = uuidv4();
    // rooms가 객체로 전달될 경우 배열로 변환
    const roomList = Array.isArray(rooms) ? rooms : Object.values(rooms);

    const reservationIds = []; // reservation_id를 담을 배열
    // 객실별로 예약 데이터 삽입
    for (const room of roomList) {
      const { adults, children } = room;
      const reservation = await Reservation.create({
        reservation_number: reservationNumber, // 동일한 예약 번호
        user_unique_id: userUniqueId,
        room_id: roomId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: adults,
        num_children: children,
        total_price: totalPrice,
        imp_uid: impUid,
        merchant_uid: merchantUid,
        pay_method: payMethod,
        pg_provider: pgProvider,
        pg_tid: pgTid,
        status: "예약완료",
      });
      reservationIds.push(reservation.reservation_id);
    }
    return { success: true, reservationIds: reservationIds}; // 생성된 reservation_id 목록을 반환
  } catch (error) {
    console.error("예약 내역 삽입 에러: ", error);
    throw new Error('예약 내역 삽입 중 에러가 발생하였습니다.');
  }
};

exports.fetchUserReservations = async (userId) => {
  try {
    const reservationList =  await Reservation.findAll({
      where: { user_unique_id: userId },
      // attributes: ['reservation_id', 'room_id', 'check_in_date', 'check_out_date'], // 예약 정보 원하면 여기에 추가
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['room_type'], // 룸타입만 가져오기
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
    if (!reservationList) {
      return { success: false, message: "예약 내역이 존재하지 않습니다." };
    }
    return { success: true, reservationList: reservationList}; 
  } catch (error) {
    console.error("예약 내역 조회 에러: ", error);
    throw new Error('예약 내역 조회 중 에러가 발생하였습니다.');
  }
  
};

exports.removeUserReservation = async (reservationId) => {
  try {
    const [removeReservation] =  await Reservation.update(
      { status: "취소 완료" },
      { where: { reservation_id: reservationId } }
    );
    if (removeReservation === 0) {
      return { success: false, message: "해당 예약이 존재하지 않거나 이미 취소되었습니다." };
    }
    return { success: true, message: "예약이 취소되었습니다." }; 
  } catch (error) {
    console.error("예약 삭제 에러: ", error);
    throw new Error('예약 삭제 중 에러가 발생하였습니다.');
  }
};

exports.insertTermsAgreement = async (reservationIds, termsAgreement) => {
  try {
    // 모든 예약에 대해 약관 동의 정보를 저장
    const termEntries = [];
    // reservationIds에 대해 반복
    for (let i = 0; i < reservationIds.length; i++) {
      const reservationId = reservationIds[i];

      // termsAgreement에 대해 반복
      for (const termId in termsAgreement) {
        if (termsAgreement.hasOwnProperty(termId)) {
          // 각 예약에 대해 약관 동의 정보를 생성
          termEntries.push({
            reservation_id: reservationId, // 각각의 reservation_id를 설정
            term_id: termId,
            is_agreed: termsAgreement[termId] ? 'Y' : 'N', // `true`이면 'Y', `false`이면 'N'
          });
        }
      }
    }
    // bulkCreate는 여러 데이터를 한 번에 추가하는 Sequelize 메서드
    await ReservationTerm.bulkCreate(termEntries);
  } catch (error) {
    console.error("약관 동의 저장 에러:", error);
    throw new Error('약관 동의 저장 중 에러가 발생하였습니다.');
  }
};
