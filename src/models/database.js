const Sequelize = require("sequelize");
const connection = new Sequelize('blogweb','root','123456',{
    host: 'localhost',
    port: "5012",
    dialect: 'mysql'
});

module.exports = connection;