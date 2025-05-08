const { Sequelize, DataTypes } = require('sequelize');

class Notice extends Sequelize.Model {
    static initiate(sequelize) {
        Notice.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            user_unique_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_unique_id',
                },
                onDelete: 'CASCADE',
            },
        }, {
            sequelize,
            timestamps: false, // updatedAt과 createdAt 자동 생성 방지
            modelName: 'Notice',
            tableName: 'notices',
            createdAt: 'created_at',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        });
    }
}

module.exports = Notice;

