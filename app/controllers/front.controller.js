const db = require("../models");
//controller Front unique

exports.renderMain=(req,res)=>{

  res.render("login");
};
exports.renderReg=(req,res)=>{

  res.render("register");
};
exports.renderMP=(req,res)=>{

  res.render("mainpage");
};
exports.renderTests=(req,res)=>{

  res.render("tests");
};
exports.renderLections=(req,res)=>{

  res.render("lection");
};
