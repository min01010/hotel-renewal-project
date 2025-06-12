const Event = require('../models/events'); // 이벤트 모델
const Image = require('../models/images');

// 모든 이벤트 정보 가져오기
exports.fetchAllEvents = async (limit = null) => {
  try {
    const events = await Event.findAll({
      attributes: ["event_id", "event_name", "title", "info", "location", "period", "time", "notice", "composition", "created_at"],
      include: [
        {
          model: Image,
          attributes: ["image_url"],
          where: { entity_type: "event" },
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit: limit || undefined, // limit이 있으면 적용, 없으면 전체 조회
    });
    if (!events) {
      return { success: false, message: "이벤트 정보를 찾을 수 없습니다." };
    }
    return { success: true, events: events };
  } catch (error) {
    console.error("이벤트 정보 조회 오류:", error);
    throw new Error("이벤트 정보 조회 중 에러가 발생하였습니다.");
  }
};

// 특정 이벤트 정보 가져오기
exports.fetchEventById = async (eventId) => {
  try {
    // 이벤트 테이블에서 정보 가져오기
    const event = await Event.findOne({
      where: { event_id: eventId },
      attributes: ["event_name", "title", "info", "location", "period", "time", "notice", "composition"],
      include: [
        {
          model: Image,
          attributes: ["image_url"],
          where: { entity_type: "event" },
          required: false,
        },
      ],
    });

    if (!event) {
      return { success: false, message: "이벤트 정보를 찾을 수 없습니다." };
    }
    return { success: true, event: event };
  } catch (error) {
    console.error("이벤트 정보 조회 오류:", error);
    throw new Error("이벤트 정보 조회 중 에러가 발생하였습니다.");
  }
};
