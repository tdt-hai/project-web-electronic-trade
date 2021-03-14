const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');

class Fee_Ship extends Model {

}
Fee_Ship.init({
    nameCity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nameDistrict: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fee_ship: {
        type: Sequelize.FLOAT,
        allowNull: false,        
        defaultValue: 0.0
    }
}, {
    sequelize: db,
    modelName: "fee_ship"
})

module.exports = Fee_Ship;