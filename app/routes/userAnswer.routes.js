
module.exports = app => {

  const userAnswer = require("../controllers/userAnswer.controller.js");
  var router = require("express").Router(); 

  router.post("/", userAnswer.create); 
  
  app.use("/api/userAnswer", router);
};
