module.exports = app => {
  const front = require("../controllers/front.controller.js");

  var router = require("express").Router();

  router.get("/login", front.renderMain); 
  router.get("/register", front.renderReg);
  router.get("/mainpage", front.renderMP);
  router.get("/tests", front.renderTests);
  router.get("/lection", front.renderLections);

  

  app.use(router); 
};
