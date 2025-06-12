const mainService = require('../services/mainService');

exports.getMainImages = async (req, res) => {
  try {
    const imagesData = await mainService.fetchMainImages();
    
    if (!imagesData.success) {
      return res.status(404).json({ success: false, message: "이미지를 찾을 수 없습니다." });
    }
    res.status(200).json({ success: true, images: imagesData.images });
  } catch (error) {
    console.error("이미지 목록 조회 에러:", error);
    res.status(500).json({ success: false, message: "서버 에러가 발생하였습니다." });
  }
};