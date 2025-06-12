const Sequelize = require('sequelize');

class Users extends Sequelize.Model {
    static initiate(sequelize) {
        Users.init({
            user_unique_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            phone_number: {
                type: Sequelize.STRING(15),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Users',
            tableName: 'users',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        });
    }
}

module.exports = Users;
