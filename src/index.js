const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection =require("./models/database");

//view engine
app.set("view engine", "ejs");

//public
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json);


//rotas
app.get("/", (req, res) =>{
    res.render("index")
});

//Database
connection
    .authenticate()
    .then(() =>{
        console.log("conexão realizada com sucesso!");
    }).catch((error) =>{
        console.log(error);
    });

//server 
app.listen(8181, function(erro) {
    if(erro){
        console.log("o servidor está com algum erro..." + erro);
    }else{
        console.log("o servidor está no ar...");
    }
});

