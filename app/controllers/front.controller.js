const db = require("../models");

//_______________________________ controller Front unique _______________________________

exports.renderMain=(req,res)=>{

  res.render("login");
};
exports.renderReg=(req,res)=>{

  res.render("register");
};
exports.renderMP = (req, res) => {
    if (req.user.role === "admin") {
        res.redirect("/adminka");
    } else {
        res.render("mainpage", { user: req.user });
    }
};

exports.renderTests=(req,res)=>{

  res.render("tests");
};
exports.renderLections=(req,res)=>{

  res.render("lection");
};
exports.renderAdminka=(req,res)=>{

  res.render("adminka");
};

