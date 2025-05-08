const Sequelize = require('sequelize');

class KakaoAuth extends Sequelize.Model {
    static initiate(sequelize) {
        KakaoAuth.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_unique_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_unique_id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            kakao_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            refresh_token: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'KakaoAuth',
            tableName: 'kakao_auth',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        });
    }
}

module.exports = KakaoAuth;
