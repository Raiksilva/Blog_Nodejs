const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const adminAuth = require("../../middlewares/adminAuth");

const Users = require("../../models/Users");


router.get("/admin/users", adminAuth,(req, res) =>{
    Users.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", adminAuth,(req, res) =>{
    res.render("admin/users/create");
});


router.post("/admin/back", adminAuth,(req, res) =>{
    res.redirect("admin/users");
});

router.post("/admin/save", adminAuth,(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({
        where:{email: email}
    }).then( user => {
        if(user == undefined){

            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            Users.create({
                email: email,
                password: hash
            }).then( () => {
                res.redirect("/");
            }).catch((err) =>{
                res.redirect("/");
            });

        }else{
            res.redirect("/admin/users/create");
        }
    });


});

router.get("/login",(req, res) =>{
    
    res.render("admin/users/login");
         
});


router.post("/authenticate", (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({where:{email:email}}).then(user =>{
        if(user != undefined){
            //validação de senha 
            let correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/categories");
            }else{
                res.redirect("login");
            }
        }else{
            res.redirect("login");
        }
    });
});

router.get("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;