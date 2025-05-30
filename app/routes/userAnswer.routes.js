
module.exports = app => {

  const userAnswer = require("../controllers/userAnswer.controller.js");
  var router = require("express").Router(); 

  router.post("/", userAnswer.create); // Отправка ответа пользователя
  
  app.use("/api/userAnswer", router);
};
