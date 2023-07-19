const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection =require("./models/database");
const Article = require("./models/Article");
const Category = require("./models/Category");
const categoriesController = require("./controller/categories/CategoriesController");
const articlersController = require("./controller/articles/ArticlesController");


//Database
connection
    .authenticate()
    .then(() =>{
        console.log("conexão realizada com sucesso!");
    }).catch((error) =>{
        console.log(error);
    });

//view engine
app.set("view engine", "ejs");

//public
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use("/", categoriesController);

app.use("/", articlersController);

//rotas
app.get("/", (req, res) =>{
    
    Article.findAll({
        order: [
            ['id', 'Desc']
        ]
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories});
        });
    });
});

app.get("/:slug",(req, res) =>{
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
      if(article != undefined){
        Category.findAll().then(categories =>{
            res.render("index", {article: article, categories: categories});
        });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) =>{
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

//server 
app.listen(8181, function(erro) {
    if(erro){
        console.log("o servidor está com algum erro..." + erro);
    }else{
        console.log("o servidor está no ar...");
    }
});

