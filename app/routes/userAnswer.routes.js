
module.exports = app => { // экспорт функции 

  const userAnswer = require("../controllers/userAnswer.controller.js"); // подключается контроллер lection

  var router = require("express").Router(); 


  router.post("/", userAnswer.create); // router.Метод POST(в скобках указваем "путь",обработчик используется для отправки новых данных на сервер с целью их создания и записи в бд
  
  app.use("/api/userAnswer", router); // это общий маршрут для данного routera
  // монтируем  наш роутер на конкретный базовый путь /work/lections
  // т.е. все, что определено в router, будет доступно под данным префиксом 
  
};
