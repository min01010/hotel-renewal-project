const Notice = require('../models/notices');

exports.fetchAllNotices = async () => {
    try {
      const notices = await Notice.findAll({ order: [["created_at", "DESC"]] });

      if (!notices) {
        return { success: false, message: "해당 공지사항을 찾을 수 없습니다." };
      }

      return { success: true, notices: notices };
      //return await Notice.findAll({ order: [["created_at", "DESC"]] });
    } catch (error) {
      console.error("공지사항 조회 에러:", error);
      throw new Error("공지사항 조회 중 에러가 발생하였습니다.");
    }
  };
  
  exports.fetchNoticeById = async (noticeId) => {
    try {
      const notice = await Notice.findOne({ where: { id: noticeId } });

      if (!notice) {
        return { success: false, message: "해당 공지사항을 찾을 수 없습니다." };
      }

      return { success: true, notice: notice };
      //return await Notice.findOne({ where: { id: noticeId } });
    } catch (error) {
      console.error("공지사항 상세 조회 에러:", error);
      throw new Error("공지사항 상세 조회 중 에러가 발생하였습니다.");
    }
  };