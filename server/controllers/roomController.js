const roomService = require("../services/roomService");

// 특정 객실 정보 가져오기
exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    // 서비스 호출
    const roomData = await roomService.fetchRoomById(roomId);

    if (!roomData.success) {
      return res.status(404).json({ success: false, message: roomData.message });
    }
    return res.status(200).json({ success: true, room: roomData.room });
  } catch (error) {
    console.error("객실 정보 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};

// 특정 부가시설 정보 가져오기
exports.getFacilityById = async (req, res) => {
  try {
    const { facilityId } = req.params;

    // 서비스 호출
    const facilityData = await roomService.fetchFacilityById(facilityId);

    if (!facilityData.success) {
      return res.status(404).json({ success: false, message: facilityData.message });
    }
    return res.status(200).json({ success: true, facility: facilityData.facility });
  } catch (error) {
    console.error("부가시설 정보 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};

// 전체 객실 목록 조회
exports.getAllRooms = async (req, res) => {
  try {
    const roomsData = await roomService.fetchAllRooms();

    if (!roomsData.success) {
      return res.status(404).json({ success: false, message: roomsData.message });
    }

    res.status(200).json({ success: true, rooms: roomsData.rooms });
  } catch (error) {
    console.error("객실 목록 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};

// 전체 부가시설 목록 조회
exports.getAllFacilities = async (req, res) => {
  try {
    const facilitiesData = await roomService.fetchAllFacilities();

    if (!facilitiesData.success) {
      return res.status(404).json({ success: false, message: facilitiesData.message });
    }
    res.status(200).json({ success: true, facilities: facilitiesData.facilities });
  } catch (error) {
    console.error("부가시설 목록 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};

// 객실 타입 조회 API
exports.getRoomTypes = async (req, res) => {
  try {
    const roomTypesData = await roomService.fetchRoomTypes();

    if (!roomTypesData.success) {
      return res.status(404).json({ success: false, message: roomTypesData.message });
    }
    res.status(200).json({ success: true, roomTypes: roomTypesData.roomTypes });
  } catch (error) {
    console.error("객실 타입 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};

// 부가시설 타입 조회 API
exports.getFacilityTypes = async (req, res) => {
  try {
    const facilityTypesData = await roomService.fetchFacilityTypes();
    
    if (!facilityTypesData.success) {
      return res.status(404).json({ success: false, message: facilityTypesData.message });
    }
    res.status(200).json({ success: true, facilityTypes: facilityTypesData.facilityTypes });
  } catch (error) {
    console.error("부가시설 타입 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생하였습니다." });
  }
};