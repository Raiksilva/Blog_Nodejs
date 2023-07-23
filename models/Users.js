const Sequelize = require("sequelize");
const connection = require("./database");

const Users = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty:{
                msg: "O e-mail do 'Usuário' não pode está em branco."
            }
        }
    },password:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: " não pode ser nulo"
            }
        }
    }
});

Users.sync({force: false}).then(() =>{

});

module.exports = Users;
