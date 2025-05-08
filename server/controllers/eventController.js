const eventService = require("../services/eventService");

// 모든 이벤트 정보 가져오기
exports.getAllEvents = async (req, res) => {
  try {
    const { limit } = req.query; // limit 값 받아오기
    const eventsData = await eventService.fetchAllEvents(limit ? parseInt(limit, 10) : null);

    if (!eventsData.success) {
      return res.status(404).json({ success: false, message: "이벤트가 없습니다." });
    }

    return res.status(200).json({ success: true, events: eventsData.events });
  } catch (error) {
    console.error("이벤트 데이터 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};

// 특정 이벤트 정보 가져오기
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventData = await eventService.fetchEventById(eventId);    

    if (!eventData.success) {
      return res.status(404).json({ success: false, message: "해당 이벤트를 찾을 수 없습니다." });
    }

    return res.status(200).json({ success: true, event: eventData.event });
  } catch (error) {
    console.error("이벤트 정보 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};