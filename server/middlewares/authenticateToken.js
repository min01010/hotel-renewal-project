// middlewares/authenticateToken.js
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Access Token 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"에서 TOKEN 추출

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Token이 제공되지 않았습니다." });
  }

  // 토큰 검증
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "유효하지 않은 Access Token입니다." });
    }

    req.user = decoded; // 검증된 사용자 정보 저장 (예: { id: user.id })
    next(); // 다음 미들웨어 또는 라우터 핸들러로 이동
  });
};

module.exports = { authenticateToken };
