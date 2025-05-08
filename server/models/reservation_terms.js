const Sequelize = require('sequelize');

class ReservationTerm extends Sequelize.Model {
  static initiate(sequelize) {
    ReservationTerm.init(
      {
        reservation_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'reservations',  // 외래 키로 참조되는 테이블
            key: 'reservation_id',
          },
          primaryKey: true, // 복합 기본 키의 첫 번째 필드
        },
        term_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'terms',  // 외래 키로 참조되는 테이블
            key: 'id',
          },
          primaryKey: true, // 복합 기본 키의 두 번째 필드
        },
        is_agreed: {
          type: Sequelize.STRING(1),
          allowNull: false,  // 'Y' 또는 'N'으로 동의 여부 기록
        },
      },
      {
        sequelize,
        modelName: 'ReservationTerm',
        tableName: 'reservation_terms',
        timestamps: false, // createdAt, updatedAt 자동 생성되지 않도록 설정
      }
    );
  }
}

module.exports = ReservationTerm;
