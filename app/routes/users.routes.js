module.exports = app => { // экспорт функции 

  const user = require("../controllers/user.controller.js"); // подключается контроллер
  var router = require("express").Router(); // создается новый экземпляр роутера, который используется для определения маршрутов, относящихся к "lection". 
  // router позволяет организовать маршруты в отдельных файлах, не засоряя главный файл server.js. 

  //Метод POST, используется для отправки новых данных на сервер с целью их создания и записи в бд
  router.post("/", user.create); // router.Метод POST(в скобках указваем "путь",обработчик(функция из контроллера)
  router.get("/", user.findAll); // Получить все 
  router.get("/:id", user.findOne);// Получить одну по ID
  router.put("/:id", user.update); // Обновить одну по ID 
  router.delete("/:id", user.delete); // Удалить
  router.delete("/", user.deleteAll); // Удалить все

  app.use("/api/users", router); // это общий маршрут для данного routera
  // монтируем  наш роутер на конкретный базовый путь /work/lections
  // т.е. все, что определено в router, будет доступно под данным префиксом 

};