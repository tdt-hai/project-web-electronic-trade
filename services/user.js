const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User extends Model {
    async updatePassword(hashedPassword) {
        this.password = hashedPassword;
        return this.save();
    };

    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    };

    static verifyPassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    };

    async updateProfile(displayName, email) {
        this.displayName = displayName;
        this.email = email;
        return this.save();
    };

    async addToken() {
        this.token = crypto.randomBytes(3).toString('hex').toUpperCase();
        return this.save();
    };

    async tokenNull() {
        this.token = null;
        return this.save();
    };
}
User.init({
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    avatar: {
        type: Sequelize.BLOB,
        defaultValue: null
    },
    isStaff: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    token: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // 0.Chưa active/ 1.Đã active/ 2.Khóa
    },
}, {
    sequelize: db,
    modelName: 'user'
});

//User.create({ username: 'admin', email: 'ltwebhcmus@gmail.com', password: '$2b$10$EzDeGTIqoNtigUsYUaX48OfSd4p4qJijA57iaH72YDNFzj6O3ijES', displayName: 'Administrator', avatar: null, isStaff: true, status: 1 });
//Password: admin@123

module.exports = User;