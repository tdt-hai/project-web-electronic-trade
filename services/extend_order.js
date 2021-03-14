const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const Extend_Product = require('./extend_product');

class Extend_Order extends Model {

    static async add(order_id, extendProductId, amount, price, t) {
        return await Extend_Order.create({
            order_id,
            extendProductId,
            amount,
            price
        }, { transaction: t })
    }

}
Extend_Order.init({
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "extend_order"
})

Extend_Order.belongsTo(Extend_Product);

module.exports = Extend_Order;