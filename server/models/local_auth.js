const Sequelize = require('sequelize');

class LocalAuth extends Sequelize.Model {
    static initiate(sequelize) {
        LocalAuth.init({
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
            local_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            password: {
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
            modelName: 'LocalAuth',
            tableName: 'local_auth',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        });
    }
}

module.exports = LocalAuth;
