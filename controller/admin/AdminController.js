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
    res.render("admin/users/create", {errorMessage: req.query.error });
});


router.post("/admin/back", adminAuth,(req, res) =>{
    res.redirect("admin/users");
});

router.post("/admin/save", adminAuth,(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({
        where:{email: email}
    }).then(user => {
        if(user == undefined){ // Verifica se o e-mail não é undefined e não é uma string vazia após remover espaços em branco.
            if (password !== undefined && password.trim() !== "") { // Verifica se a senha não é undefined e não é uma string vazia após remover espaços em branco.
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            Users.create({
                email: email,
                password: hash
            }).then( () => {
                res.redirect("/admin/users");
            }).catch((err) =>{
                res.redirect("/admin/users/create?error=E-mail campo do E-mail não pode está vazio!");
            });
            }else{
                res.redirect("/admin/users/create?error=E-mail campo da senha não pode está vazio!");
            }
        }else{
            res.redirect("/admin/users/create?error=Este e-mail já foi cadastrado, insira outro e-mail!");
        }
    });
});

router.get("/login",(req, res) =>{
    
    res.render("admin/users/login",{errorMessage: req.query.error});
         
});


router.post("/authenticate", (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({where:{email:email}}).then(user =>{
        if(!email && !password){
            res.redirect("login?error=Prenchar os campos do e-mail e senha!");
        }else if(user != undefined){
            //validação de senha 
            let correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/categories");
            }else{
                res.redirect("login?error=E-mail ou senha incorretos!");
            }
        }else{
            res.redirect("login?error=E-mail ou senha incorretos!");
        }
    });
});

router.get("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;