const Sequelize = require('sequelize');

class Event extends Sequelize.Model {
    static initiate(sequelize) {
        Event.init({
            event_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            event_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            info: {
                type: Sequelize.TEXT, // mediumtext에 대응
                allowNull: true,
            },
            location: {
                type: Sequelize.TEXT, 
                allowNull: true,
            },
            period: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            time: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            notice: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            info: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            composition: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Event',
            tableName: 'events',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}

module.exports = Event;
