module.exports = app => { // экспорт функции 

  const lab = require("../controllers/lab.controller.js"); // подключается контроллер lection

  var router = require("express").Router(); // создается новый экземпляр роутера, который используется для определения маршрутов, относящихся к "lection". 
  // router позволяет организовать маршруты в отдельных файлах, не засоряя главный файл server.js. 
  //_______________________________ Head router_______________________________

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


  app.use("/api/lab", router); // это общий маршрут для данного routera
  // монтируем  наш роутер на конкретный базовый путь /work/lections
  // т.е. все, что определено в router, будет доступно под данным префиксом 
  
};
