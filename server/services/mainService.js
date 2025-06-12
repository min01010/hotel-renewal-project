const Image = require("../models/images");

exports.fetchMainImages = async () => {
  try {
    const images = await Image.findAll({
      where: {
        is_main: 1,
        entity_type: 'hotel', // entity_type이 '호텔'인 이미지만 필터링
      },
      attributes: ['image_id', 'entity_type', 'entity_id', 'image_url'], // 필요한 속성만 가져옴
    });
    if (!images) {
      return { success: false, message: "이미지를 찾을 수 없습니다." };
    }
    return { success: true, images: images };
  } catch (error) {
    console.error("이미지 조회 오류:", error);
    throw new Error("이미지 조회 중 에러가 발생하였습니다.");
  }
};
