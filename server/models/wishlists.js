const Sequelize = require('sequelize');

class Wishlist extends Sequelize.Model {
    static initiate(sequelize) {
        Wishlist.init({
            wishlist_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_unique_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Wishlist',
            tableName: 'wishlist',
            createdAt: 'created_at',
            updatedAt: false,
        });
    }
}

module.exports = Wishlist;
