module.exports = app => {
  const lab = require("../controllers/lab.controller.js"); 
  var router = require("express").Router(); 

  // Получение данных
  router.get("/allHead", lab.findAllHead);           
  router.get("/oneHead/:id", lab.findOneHead);       
  router.get("/allBody", lab.findAllBody);           
  router.get("/allAnswer", lab.findAllAnswer);       
  router.get("/user-stats", lab.getUserAnswersStats);

  // Создание данных
  router.post("/head", lab.createHead);              
  router.post("/body", lab.createBody);              
  router.post("/answer", lab.createAnswers);         

  // Обновление данных
  router.put("/head/:id", lab.updateHead);           
  router.put("/body/:id", lab.updateBody);           
  router.put("/answer/:id", lab.updateAnswer);       

  // Удаление данных
  router.delete("/head/:id", lab.deleteHead);       
  router.delete("/body/:id", lab.deleteBody);        
  router.delete("/answer/:id", lab.deleteAnswer);   

  // Префикс маршрутов
  app.use("/api/lab", router); 
};
