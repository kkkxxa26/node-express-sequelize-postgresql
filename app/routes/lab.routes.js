module.exports = app => {

  // router позволяет организовать маршруты в отдельных файлах, не засоряя главный файл server.js. 
  const lab = require("../controllers/lab.controller.js"); 
  var router = require("express").Router(); // создается новый экземпляр роутера, который используется для определения маршрутов, относящихся к "lection". 
  
  router.get("/allHead", lab.findAllHead);
  router.get("/oneHead/:id" , lab.findOneHead);
  router.get("/allBody", lab.findAllBody);
  router.get("/allAnswer", lab.findAllAnswer);
  
  router.post("/head", lab.createHead);
  router.post("/body", lab.createBody);
  router.post("/answer", lab.createAnswers);
  
  router.put("/head/:id", lab.updateHead);
  router.put("/body/:id", lab.updateBody);
  router.put("/answer/:id", lab.updateAnswer);

  router.delete("/head/:id", lab.deleteHead);
  router.delete("/body/:id", lab.deleteBody);
  router.delete("/answer/:id", lab.deleteAnswer);

  app.use("/api/lab", router); 
};
