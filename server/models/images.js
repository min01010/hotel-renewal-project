const Sequelize = require('sequelize');

class Image extends Sequelize.Model {
    static initiate(sequelize) {
        Image.init({
            image_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            entity_type: {
                type: Sequelize.ENUM('hotel', 'room', 'facility', 'event', 'etc'),
                allowNull: false,
            },
            entity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            is_main: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Image',
            tableName: 'images',
            createdAt: 'created_at',
            updatedAt: false, // updated_at 필드가 필요하지 않다면 false로 설정
        });
    }
}

module.exports = Image;
