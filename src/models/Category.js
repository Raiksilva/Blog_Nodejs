const Sequelize = require("Sequelize");
const connection = require("./database");

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty:{
                msg: "O título da 'categoria' não pode está em branco."
            }
        }
    },slug:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: "O sloga não pode ser nulo"
            }
        }
    }
});

Category.sync({force: false}).then(() =>{

});

module.exports = Category;
