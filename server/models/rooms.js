const Sequelize = require('sequelize');

class Room extends Sequelize.Model {
    static initiate(sequelize) {
        Room.init({
            room_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            room_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
            notice: {
                type: Sequelize.TEXT,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            amenities_basic: {
                type: Sequelize.TEXT,
            },
            amenities_bedroom: {
                type: Sequelize.TEXT,
            },
            amenities_bathroom: {
                type: Sequelize.TEXT,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Rooms',
            tableName: 'rooms',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}

module.exports = Room;
