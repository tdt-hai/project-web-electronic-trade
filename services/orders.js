const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const Extend_Order = require('./extend_order');
const { Op } = require("sequelize");

class Orders extends Model {
    static async updateTotalPrice(id, fee_ship, total_price, t) {
        return Orders.update({
            fee_ship,
            total_price
        }, {
            where: {
                id
            },
            transaction: t
        })
    }

    async saveOrders(customer_name, customer_phone, customer_email, address, note) {
        this.customer_name = customer_name,
        this.customer_phone = customer_phone,
        this.customer_email = customer_email,
        this.address = address,
        this.note = note
        return this.save();
    }

    static async addOrder(customer_name,
        customer_phone, customer_email, address, note, isShip, t) {
        return Orders.create({
            customer_name,
            customer_phone,
            customer_email,
            address,
            note,
            isShip
        }, { transaction: t })
    }

    async cancelOrderByCustomer() {
        this.isDeleted = true,
        this.isDone = true,
        this.note = this.note + '<KHÁCH TỰ HỦY>'
        return this.save();
    }

    async cancelOrderByStaff() {
        this.isDeleted = true,
        this.isDone = true,
        this.status = -1,
        this.note = this.note + '<STAFF HỦY>'
        return this.save();
    }

    async confirm(status) {
        this.isDeleted = false,
        this.isConfirmed = true,
        this.status = status
        return this.save();
    }

    async paidOrder() {
        this.isConfirmed = true,
        this.status = 1,
        this.isDone = true
        return this.save();
    }
}
Orders.init({
    /* thông tin khách hàng */
    customer_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customer_phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customer_email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // nếu nhận tại cửa hàng thì địa chỉ == tai_cua_hang
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // lưu ý của khách hàng
    note: {
        type: Sequelize.STRING,
    },
    fee_ship: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
    },
    total_price: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
    },
    isShip: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    isDone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize: db,
    modelName: "orders"
})

Orders.hasMany(Extend_Order, { sourceKey: "id", foreignKey: "order_id" });

module.exports = Orders;