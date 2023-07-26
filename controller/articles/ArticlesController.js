const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Article = require("../../models/Article");
const slugify = require("slugify");
const { json } = require("body-parser");
const adminAuth = require("../../middlewares/adminAuth");


router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles})
    });
});

router.get("/admin/articles/new", adminAuth, (req ,res) => {
    Category.findAll({
        order: [
            ['title', 'ASC']
        ]
    }).then(categories => {
        const errorMessage = req.query.error || null;
        res.render("admin/articles/new",{categories, errorMessage});
    })    
});

router.post("/articles/save", adminAuth, (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    if(!body && !title){
        res.redirect("/admin/articles/new?error=O título e corpo do artigo não podem estar vazio!");
    }else if(!title){
        res.redirect("/admin/articles/new?error=O título do artigo não pode estar vazio!");
    }
    else if(!body){
        res.redirect("/admin/articles/new?error=O corpo do artigo não pode estar vazio!");
    }else{
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch((err) =>{
           res.redirect("/admin/articles/new?error=Ocorreu um erro ao tentar criar o artigo!");
        });
    }
});


router.post("/articles/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{// NÃO FOR UM NÚMERO
            res.redirect("/admin/articles");
        }
    }else{ // NULL
        res.redirect("/admin/articles");
    }
});

router.post("/articles/back", adminAuth, (req, res) =>{
    res.redirect("/admin/articles");
});

router.get("/admin/articles/edit/:id",  adminAuth, (req, res) =>{
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect("admin/articles");
    }
    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll({
                order: [
                    ['title', 'ASC']
                ]
            }).then(categories =>{
                res.render("admin/articles/edit", {article: article ,categories: categories});
            });
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(err =>{
        res.redirect("/admin/articles");
        console.log(err);
    });
});

router.post("/articles/update", adminAuth, (req, res) =>{
    let id =  req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category; 

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category},{
        where: {
            id: id
        },
    }).then(() =>{
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num", (req, res) => {
    let page = parseInt(req.params.num);
    let offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (page - 1) * 5;
    }

    Article.findAndCountAll({
        limit: 5,
        offset: offset,
        order: [
            ['id', 'Desc']
        ]
    }).then(articles => {
        
        let next;
        if(offset + 5 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        let result ={
            page: page,
            next: next,
            articles : articles
        }
        Category.findAll().then(categories =>{
           res.render("admin/articles/page", {result: result, categories: categories});
        });
    });
});


module.exports = router;