const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Article = require("../../models/Article");
const slugify = require("slugify");
const { json } = require("body-parser");


router.get("/admin/articles" ,(req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles})
    });
});

router.get("/admin/articles/new",(req ,res) => {
    Category.findAll({
        order: [
            ['title', 'ASC']
        ]
    }).then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })    
})

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});


router.post("/articles/delete", (req, res) => {
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

router.get("/admin/articles/edit/:id", (req, res) =>{
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

router.post("/articles/update", (req, res) =>{
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
        res.redirect("/")
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
            next: next,
            articles : articles
        }
        Category.findAll().then(categories =>{
           res.render("admin/articles/page", {result: result, categories: categories}) 
        });
    });
});


module.exports = router;