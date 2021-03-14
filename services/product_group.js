const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const { Op } = require("sequelize");

class Product_Group extends Model {

    static async findProductGroup(type, producer) {
        return Product_Group.findAll({
            where: {
                type, producer
            }
        });
    }
    static async findProductGr(type, producer) {
        return Product_Group.findAll({
            where: { type, producer },
            order: [
                ['id', 'DESC'],
            ]
        })
    }
    static async findProductById(id) {
        return Product_Group.findByPk(id);
    }

    static async updateStatus(id) {
        let product_group = await this.findProductById(id);
        return await Product_Group.update({
            status: product_group.status == true ? false : true
        }, {
            where: {
                id: id
            }
        });
    }
    //delete product by id
    static async deleteProduct(id) {
        return Product_Group.destroy({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
    }
    static async add(name, type, producer, status) {
        return Product_Group.create({
            groupName: name,
            type,
            producer,
            status
        })
    }
    static async updateProduct(id, name, type, producer, status) {
        return await Product_Group.update({
            id,
            groupName: name,
            type,
            producer,
            status
        }, {
            where: {
                id
            }
        });
    }
}
Product_Group.init({
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { args: true, msg: "You must enter a name" }
        }
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "You must enter a type" }
        }
    },
    producer: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "You must enter a producer" }
        }
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notNull: { args: true, msg: "You must enter a status" }
        }
    }
}, {
    sequelize: db,
    modelName: "product_group"
})

module.exports = Product_Group