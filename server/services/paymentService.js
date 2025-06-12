const axios = require("axios");
require("dotenv").config();

const getAccessToken = async () => {
  const { IAMPORT_API_KEY, IAMPORT_API_SECRET } = process.env;

  const response = await axios.post("https://api.iamport.kr/users/getToken", {
    imp_key: IAMPORT_API_KEY,
    imp_secret: IAMPORT_API_SECRET,
  });

  return response.data.response.access_token;
};

exports.verifyPayment = async (imp_uid) => {
  const accessToken = await getAccessToken();

  const paymentResponse = await axios.get(
    `https://api.iamport.kr/payments/${imp_uid}`,
    {
      headers: {
        Authorization: accessToken,
      },
    }
  );

  return paymentResponse.data.response; // 결제 정보
};
