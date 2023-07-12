const express = require("express");
const router = new express.Router();
const Category = require("../../models/Category");



router.get("/admin/articles/new", (req, res) =>{
    res.render("admin/articles/new");
});

module.exports = router;