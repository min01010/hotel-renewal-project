const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // .env 파일에서 환경 변수 로드

// 환경 변수에서 DB 정보 가져오기
const sequelize = new Sequelize(
  process.env.DB_DATABASE,  // 데이터베이스 이름
  process.env.DB_USER,      // 사용자 이름
  process.env.DB_PASSWORD,  // 비밀번호
  {
    host: process.env.DB_HOST, // 호스트
    dialect: 'mariadb',           // 사용하고자 하는 DB의 종류 (mysql, postgres 등)
    port: 1000,                 // DB 포트 (여기서는 1000)
  }
);

module.exports = sequelize; // Sequelize 인스턴스 내보내기
