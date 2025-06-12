const Sequelize = require('sequelize');

class Facility extends Sequelize.Model {
    static initiate(sequelize) {
        Facility.init({
            facility_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            facility_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            info: {
                type: Sequelize.TEXT,
            },
            regulation: {
                type: Sequelize.TEXT,
            },
            location: {
                type: Sequelize.TEXT,
            },
            period: {
                type: Sequelize.TEXT,
            },
            hours_of_operation: {
                type: Sequelize.TEXT,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Facility',
            tableName: 'facilities',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}

module.exports = Facility;
