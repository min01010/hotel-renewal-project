const Sequelize = require('sequelize');

class Reservation extends Sequelize.Model {
    static initiate(sequelize) {
        Reservation.init({
            reservation_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            reservation_number: {
                type: Sequelize.STRING(36),
                allowNull: false,
            },
            user_unique_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            check_in_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            check_out_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            num_adults: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            num_children: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            total_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: '예약완료',
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Reservation',
            tableName: 'reservation',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }
}

module.exports = Reservation;
