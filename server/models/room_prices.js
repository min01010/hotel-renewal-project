const Sequelize = require('sequelize');

class RoomPrice extends Sequelize.Model {
    static initiate(sequelize) {
        RoomPrice.init({
            price_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            season: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
          
        }, {
            sequelize,
            timestamps: true,
            modelName: 'RoomPrice',
            tableName: 'room_prices',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}

module.exports = RoomPrice;
