const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');

class Extend_Product extends Model {

    static async findExtendProductById(productId) {
        return await Extend_Product.findAll({
            where: {
                productId
            },
            order: [
                ['id', 'ASC'],
            ]
        })
    }
    
    static async updateAmount(amount , id, t) {
        return await Extend_Product.update({
            amount
        },{ transaction: t,
            where: {
                id
            },
        })
    }

    static async findByColor(productId, color) {
        return await Extend_Product.findOne({
            where: {
                productId,
                color
            }
        });
    }

    static async deleteByProductId(productId) {
        return await Extend_Product.destroy({
            where: {
                productId
            }
        })
    }

    static async deleteLastRow(id) {
        return await Extend_Product.destroy({
            where: {
                id
            }
        })
    }

    static async updateExtendProduct(id, color, amount, path_image) {
        return await Extend_Product.update({
            color,
            amount,
            path_image,
        }, {
            where: {
                id,
            }
        });
    }

    static async add(productId, color, amount, path_image) {
        return Extend_Product.create({
            productId,
            color,
            amount,
            path_image
        });
    }

    async updateQty(qty) {
        this.amount = this.amount + qty
        return this.save();
    }
}
Extend_Product.init({
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    color: {
        type: Sequelize.STRING,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    path_image: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: "extend_product"
})

module.exports = Extend_Product