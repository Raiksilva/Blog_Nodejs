const Sequelize = require("sequelize");
const connection = require("./database");
const Category = require("./Category"); 


const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:"O campo 'artigo' não pode ser nulo."
            }
        }
    },slug:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: "O sloga não pode ser nulo,"
            }
        }
    },body:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:"O corpo do artigo não pode ser nulo."
            }
        }
    }
});

Category.hasMany(Article); // Uma Categoria tem muitos artigos.
Article.belongsTo(Category);// Um Artigo pertence a uma categoria.


Article.sync({force: false}).then(() =>{

});

module.exports = Article;