const paymentService = require("../services/paymentService");

exports.verifyPayment = async (req, res) => {
  const { imp_uid } = req.body;
  
  try {
    const paymentInfo = await paymentService.verifyPayment(imp_uid);
    res.status(200).json({ success: true, paymentInfo });
  } catch (error) {
    console.error("결제 검증 실패:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};