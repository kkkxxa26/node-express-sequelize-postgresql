module.exports = app => { // экспорт функции 

  const lections = require("../controllers/lection.controller.js"); // подключается контроллер lection

  var router = require("express").Router(); // создается новый экземпляр роутера, который используется для определения маршрутов, относящихся к "lection". 
  // router позволяет организовать маршруты в отдельных файлах, не засоряя главный файл server.js. 
  //_______________________________ lections router_______________________________

  router.post("/", lections.create); // router.Метод POST(в скобках указваем "путь",обработчик используется для отправки новых данных на сервер с целью их создания и записи в бд
  router.get("/", lections.findAll);// Получить все лекции 
  router.get("/:id", lections.findOne);// Получить одну лекцию по ID
  router.put("/:id", lections.update); // Обновить лекцию по ID     
  router.delete("/:id", lections.delete);// Удалить     
  router.delete("/", lections.deleteAll);// Удалить все  

  app.use("/api/lections", router); // это общий маршрут для данного routera
  // монтируем  наш роутер на конкретный базовый путь /work/lections
  // т.е. все, что определено в router, будет доступно под данным префиксом 
  
};
