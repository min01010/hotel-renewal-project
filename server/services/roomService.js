const Room = require('../models/rooms');
const Facility = require('../models/facilities');
const Image = require('../models/images');

exports.fetchRoomById = async (roomId) => {
  try {
    // rooms 테이블에서 정보 가져오기
    const room = await Room.findOne({
      where: { room_id: roomId },
      attributes: ["room_type", "title", "description", "amenities_basic", "amenities_bedroom", "amenities_bathroom", "notice"],
      include: [
        {
          model: Image,
          attributes: ["image_url"],
          where: { entity_type: "room" },
          required: false,
        },
      ],
    });

    if (!room) {
      return { success: false, message: "객실 정보가 존재하지 않습니다." };
    }
    return { success: true, room: room };
  } catch (error) {
    console.error("객실 정보 조회 에러:", error);
    throw new error("객실 정보 조회 중 에러가 발생하였습니다.");
  }
};

exports.fetchFacilityById = async (facilityId) => {
  try {
    const facility = await Facility.findOne({
      where: { facility_id: facilityId },
      attributes: ["facility_type", "title", "info", "regulation", "location", "period", "hours_of_operation"],
      include: [
        {
          model: Image,
          attributes: ["image_url"],
          where: { entity_type: "facility" },
          required: false,
        },
      ],
    });
    if (!facility) {
      return { success: false, message: "부가시설 정보가 존재하지 않습니다." };
    }
    return { success: true, facility: facility };
  } catch (error) {
    console.error("부가시설 정보 조회 에러:", error);
    throw new error("부가시설 정보 조회 중 에러가 발생하였습니다.");
  }
};

// 전체 객실 목록 조회 (이미지 정보 포함)
exports.fetchAllRooms = async () => {
  try {
    const rooms = await Room.findAll({
      attributes: ["room_id", "room_type", "title"],  // 객실 정보
      include: [
        {
          model: Image,  // Image 모델을 조인
          attributes: [ "entity_id", "image_url" ],  // 가져올 이미지 정보 (image_url, is_main 등)
          where: { entity_type: "room" },  // entity_type이 'room'인 이미지만 가져오기
          required: false,  // 이미지가 없는 객실도 포함하려면 false로 설정
        },
      ],
    });
    if (!rooms) {
      return { success: false, message: "객실 정보가 존재하지 않습니다." };
    }
    return { success: true, rooms: rooms };

  } catch (error) {
    console.error("객실 목록 조회 에러:", error);
    throw new error("전체 객실 목록 조회 중 에러가 발생하였습니다.");
  }
};

// 전체 부가시설 목록 조회
exports.fetchAllFacilities = async () => {
  try {
    const facilities = await Facility.findAll({
      attributes: ["facility_id", "facility_type", "title"],
      include: [
        {
          model: Image,  // Image 모델을 조인
          attributes: [ "entity_id", "image_url" ],  // 가져올 이미지 정보 (image_url, is_main 등)
          where: { entity_type: "facility" },  // entity_type이 'room'인 이미지만 가져오기
          required: false,  // 이미지가 없는 객실도 포함하려면 false로 설정
        },
      ],
    });
    if (!facilities) {
      return { success: false, message: "부가시설 정보가 존재하지 않습니다." };
    }
    return { success: true, facilities: facilities };

  } catch (error) {
    console.error("부가시설 목록 조회 에러:", error);
    throw new error("전체 부가시설 목록 조회 중 에러가 발생하였습니다.");
  }
};

// 객실 타입 목록 조회
exports.fetchRoomTypes = async () => {
  try {
    const roomTypes = await Room.findAll({
      attributes: ["room_id","room_type"], // 객실 타입만 가져옴
      group: ["room_type"], // 중복 제거
    });
    if (!roomTypes) {
      return { success: false, message: "객실 정보가 존재하지 않습니다." };
    }
    return { success: true, roomTypes: roomTypes };
  } catch (error) {
    console.error("객실 타입 조회 에러:", error);
    throw new error("객실 타입 조회 중 에러가 발생하였습니다.");
  }
};

// 부가시설 타입 목록 조회
exports.fetchFacilityTypes = async () => {
  try {
    const facilityTypes = await Facility.findAll({
      attributes: ["facility_id", "facility_type"], // 부가시설 타입만 가져옴
      group: ["facility_type"], // 중복 제거
    });
    if (!facilityTypes) {
      return { success: false, message: "부가시설 정보가 존재하지 않습니다." };
    }
    return { success: true, facilityTypes: facilityTypes };
  } catch (error) {
    console.error("부가시설 타입 조회 에러:", error);
    throw new error("부가시설 타입 조회 중 에러가 발생하였습니다.");
  }
};