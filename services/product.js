const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const Extend_Product = require('./extend_product');
const { Op } = require("sequelize");

class Products extends Model {

    /////////////////// COUNT /////////////
    static async countProducts(type) {
        return Products.count({
            where: {
                status: true,
                type
            },
            order: [
                ['price', 'DESC']
            ]
        })
    }

    static async countCateProductLT(type, f_price) {
        return Products.count({
            where: {
                status: true,
                type,
                price: { [Op.lt]: f_price }
            }
        })
    }

    static async countCateProductBrandLT(type, f_price, brand) {
        return Products.count({
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.lt]: f_price }
            }
        })
    }

    static async countCateProductGT(type, f_price) {
        return Products.count({
            where: {
                status: true,
                type,
                price: { [Op.gt]: f_price }
            }
        })
    }

    static async countCateProductBrandGT(type, f_price, brand) {
        return Products.count({
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.gt]: f_price }
            }
        })
    }

    static async countCateProductFrom(type, f_Fprice, f_Tprice) {
        return Products.count({
            where: {
                status: true,
                type,
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            }
        })
    }

    static async countCateProductBrandFrom(type, f_Fprice, f_Tprice, brand) {
        return Products.count({
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            }
        })
    }

    static async countProductsByBrand(type, brand) {
        return Products.count({
            where: {
                producer: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('producer')), 'LIKE', brand),
                status: true,
                type
            }
        })
    }
    
    ////////////////////////////////// FILTER //////////////////////////////////////
    static async filterCateProductLT(start, limit, type, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.lt]: f_price }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async filterCateProductBrandLT(start, limit, type, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.lt]: f_price }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async filterCateProductGT(start, limit, type, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.gt]: f_price }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async filterCateProductBrandGT(start, limit, type, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.gt]: f_price }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async filterCateProductFrom(start, limit, type, f_Fprice, f_Tprice) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async filterCateProductBrandFrom(start, limit, type, f_Fprice, f_Tprice, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    /////////////////// SORT //////////////////////////////////
    // ASC is default
    // include sort by price, sort by common (isSortByPriceASC == 'ASC' or 'DESC')
    static async sortCate(start, limit, type, isSortByPriceASC, isSortByPrice) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async sortCateCommon(start, limit, type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    // ASC is default
    // include sort by price, sort by common (isSortByPriceASC == 'ASC' or 'DESC')
    //by brand
    static async sortCateByBrand(start, limit, type, isSortByPriceASC, isSortByPrice, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('producer')), 'LIKE', brand)
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async sortCateCommonByBrand(start, limit, type, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('producer')), 'LIKE', brand)
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    /////////////// FILTER & SORT ///////////////////////
    static async filtersortCateCommonLT(start, limit, type, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.lt]: f_price }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandCommonLT(start, limit, type, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.lt]: f_price }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateCommonGT(start, limit, type, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.gt]: f_price }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandCommonGT(start, limit, type, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.gt]: f_price }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateCommonFrom(start, limit, type, f_Fprice, f_Tprice) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandCommonFrom(start, limit, type, f_Fprice, f_Tprice, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                ['isNoiBat', 'DESC']
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateLT(start, limit, type, isSortByPriceASC, isSortByPrice, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.lt]: f_price }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandLT(start, limit, type, isSortByPriceASC, isSortByPrice, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.lt]: f_price }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateFrom(start, limit, type, isSortByPriceASC, isSortByPrice, f_Fprice, f_Tprice) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandFrom(start, limit, type, isSortByPriceASC, isSortByPrice, f_Fprice, f_Tprice, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.between]: [f_Fprice, f_Tprice] }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateGT(start, limit, type, isSortByPriceASC, isSortByPrice, f_price) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                price: { [Op.gt]: f_price }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    static async filtersortCateBrandGT(start, limit, type, isSortByPriceASC, isSortByPrice, f_price, brand) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('producer')), 'LIKE', brand),
                price: { [Op.gt]: f_price }
            },
            order: [
                isSortByPrice == true ? isSortByPriceASC == true ? ['price', 'ASC'] : ['price', 'DESC'] : ['price', 'DESC'],
            ],
            offset: start,
            limit
        })
    }

    ///////////////// FIND ////////////////////////////
    static async findProductById(id) {
        return Products.findByPk(id);
    }

    static async findByCate(start, limit, type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async findByName(name, limit) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase().trim() + '%')
            },
            limit
        })
    }

    static async countByName(name) {
        return Products.count({
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase().trim() + '%')
            },
        })
    }

    static async findByNameAndPhuKien(name) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase().trim() + '%'),
                type: 'phu-kien'
            },
        })
    }

    static async findByNameAndSanPham(name) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                name: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase().trim() + '%'),
                type: { [Op.notLike]: 'phu-kien' }
            },
        })
    }

    static async findOneProduct(path_url) {
        return Products.findOne({
            include: [{
                model: Extend_Product,
            }],
            where: {
                path_url,
                status: true
            },
            order: [
                [Extend_Product, 'id', 'ASC'],
            ]
        })
    }
    static async findAllProductByProducer(producer,type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                producer
            },
            order: [
                ['createdAt', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            limit: 10
        })
    }
    static async findAllProductByHighlights(type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type,
                isNoiBat: true
            },
            order: [
                Sequelize.literal('random()'),
                ['createdAt', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            limit: 10
        })
    }
    static async findAllProductByTablet(type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type
            },
            order: [
                Sequelize.literal('random()'),
                ['createdAt', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            limit: 5
        })
    }
    static async findAllProductByType(type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                type
            },
            order: [
                ['createdAt', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            limit: 10
        })
    }
    
    static async findProductGroupnotPath(type, producer, groupId, notPath) {
        return Products.findAll({
            where: {
                status: true,
                type,
                producer,
                group: groupId,
                path_url: { [Op.not]: notPath },
            },
            order: [
                ['id', 'ASC'],
            ],
        })
    }

    static async findProductSameBrand(notPath, type, producer, limit) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                status: true,
                path_url: { [Op.not]: notPath },
                type,
                producer
            },
            order: [
                Sequelize.literal('random()'),
                [Extend_Product, 'id', 'ASC'],
            ],
            limit
        })
    }

    static async findByBrand(brand, start, limit, type) {
        return Products.findAll({
            include: [{
                model: Extend_Product,
            }],
            where: {
                producer: Sequelize.where(Sequelize.fn('LOWER',
                    Sequelize.col('producer')), 'LIKE', brand),
                status: true,
                type
            },
            order: [
                ['id', 'DESC'],
                [Extend_Product, 'id', 'ASC'],
            ],
            offset: start,
            limit
        })
    }

    static async findProductByName(name) {
        return Products.findOne({
            where: {
                name
            }
        })
    }


    ////////////////// ADD

    static async add(type, producer, group, name, price, screen, operation,
        cam_behind, cam_front, cpu, ram, storage, sim, pin,
        released, path_url, describe_content, conversation, network_connection, productScreenSW, screen_size, battery_life_time,
        OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, functionP, output,
        tech_util, wire_length, trademark, made_in, isHangCongTy,
        isTraGop, isSieuGiamGia, isNoiBat, status) {
        return Products.create({
            type, producer, group, name, price, screen, operation,
            cam_behind, cam_front, cpu, ram, storage, sim, pin,
            released, path_url, describe_content, conversation, network_connection, productScreenSW, screen_size, battery_life_time,
            OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, functionP, output,
            tech_util, wire_length, trademark, made_in, isHangCongTy,
            isTraGop, isSieuGiamGia, isNoiBat, status
        })
    }

    ///////////////////////// UPDATE

    static async updateStatus(id) {
        let product = await this.findProductById(id);
        return await Products.update({
            status: product.status == true ? false : true
        }, {
            where: {
                id: id
            }
        });
    }

    /////////////////////// DELETE

    //delete product by id
    static async deleteProduct(id) {
        return Products.destroy({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        });
    }
    //update product by id
    static async updateProduct(id, type, producer, group, name, price, screen, operation,
        cam_behind, cam_front, cpu, ram, storage, sim, pin,
        released, path_url, describe_content, conversation, network_connection, productScreenSW, screen_size, battery_life_time,
        OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, functionP, output,
        tech_util, wire_length, trademark, made_in, isHangCongTy,
        isTraGop, isSieuGiamGia, isNoiBat, status) {

        return await Products.update({
            type, producer, group, name, price, screen, operation,
            cam_behind, cam_front, cpu, ram, storage, sim, pin,
            released, path_url, describe_content, conversation, network_connection, productScreenSW, screen_size, battery_life_time,
            OS_SW, connect_os, face_material, face_diameter, connect, language, health_monitor, functionP, output,
            tech_util, wire_length, trademark, made_in, isHangCongTy,
            isTraGop, isSieuGiamGia, isNoiBat, status
        }, {
            where: {
                id
            }
        });
    }

}

Products.init({
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    producer: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    group: {
        type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    screen: {
        type: Sequelize.STRING,
    },
    operation: {
        type: Sequelize.STRING,
    },
    cam_behind: {
        type: Sequelize.STRING,
    },
    cam_front: {
        type: Sequelize.STRING,
    },
    cpu: {
        type: Sequelize.STRING,
    },
    ram: {
        type: Sequelize.STRING,
    },
    storage: {
        type: Sequelize.STRING,
    },
    sim: {
        type: Sequelize.STRING,
    },
    pin: {
        type: Sequelize.STRING,
    },
    released: {
        type: Sequelize.STRING,
    },
    path_url: {
        type: Sequelize.STRING,
        unique: true
    },
    describe_content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    conversation: {
        type: Sequelize.TEXT,
    },
    network_connection: {
        type: Sequelize.TEXT,
    },
    productScreenSW: {
        type: Sequelize.TEXT,
    },
    screen_size: {
        type: Sequelize.TEXT,
    },
    battery_life_time: {
        type: Sequelize.TEXT,
    },
    OS_SW: {
        type: Sequelize.TEXT,
    },
    connect_os: {
        type: Sequelize.TEXT,
    },
    face_material: {
        type: Sequelize.TEXT,
    },
    face_diameter: {
        type: Sequelize.TEXT,
    },
    connect: {
        type: Sequelize.TEXT,
    },
    language: {
        type: Sequelize.TEXT,
    },
    health_monitor: {
        type: Sequelize.TEXT,
    },
    functionP: {
        type: Sequelize.TEXT,
    },
    output: {
        type: Sequelize.TEXT,
    },
    tech_util: {
        type: Sequelize.TEXT,
        defaultValue: 'Không'
    },
    wire_length: {
        type: Sequelize.TEXT,
        defaultValue: 'Không'
    },
    trademark: {
        type: Sequelize.TEXT,
    },
    made_in: {
        type: Sequelize.TEXT,
    },
    isHangCongTy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isTraGop: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isSieuGiamGia: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isNoiBat: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: 'products'
});
Products.hasMany(Extend_Product, { foreignKey: "productId", sourceKey: "id" });
Extend_Product.belongsTo(Products);

module.exports = Products;