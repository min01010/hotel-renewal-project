const noticeService = require("../services/noticeService");

// 서버 컨트롤러
exports.getAllNotices = async (req, res) => {
    try {
      const noticesData = await noticeService.fetchAllNotices();

      if (!noticesData.success) {
        return res.status(404).json({ success: false, message: "공지사항을 찾을 수 없습니다." });
      }

      res.status(200).json({ success: true, notices: noticesData.notices });
    } catch (error) {
      console.error("공지사항 조회 에러:", error);
      res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
    }
  };
  
  exports.getNoticeById = async (req, res) => {
    try {
      const { noticeId } = req.params;
      const noticeData = await noticeService.fetchNoticeById(noticeId);

      if (!noticeData.success) {
        return res.status(404).json({ success: false, message: "해당 공지사항을 찾을 수 없습니다." });
      }

      res.status(200).json({ success: true, notice: noticeData.notice });
    } catch (error) {
      console.error("공지사항 상세 조회 에러:", error);
      res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
    }
  };
  