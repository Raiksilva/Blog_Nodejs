const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

const connection =require("./models/database");
const Article = require("./models/Article");
const Category = require("./models/Category");
const Users = require("./models/Users");

const categoriesController = require("./controller/categories/CategoriesController");
const articlersController = require("./controller/articles/ArticlesController");
const adminController = require("./controller/admin/AdminController");


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

//Sessions
app.use(session({
    secret: "Clacketyclankblipzorpwizzbopflutterglint", 
    cookie: { maxAge: 300000}
}));

//public
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Definindo que queremos usar os controllers
app.use("/", categoriesController);
app.use("/", articlersController);
app.use("/", adminController);

//rotas
app.get("/", (req, res) =>{
    
    Article.findAll({
        order: [
            ['id', 'Desc']
        ],
        limit: 5
    }).then(articles => {
        Category.findAll({
            order:[
                ['title', 'ASC']
            ]
        }).then(categories =>{
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
            res.render("articles", {article: article, categories: categories});
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
    }).then( category => {
        if(category != undefined){
            
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
            
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

