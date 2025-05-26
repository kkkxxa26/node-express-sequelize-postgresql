module.exports = app => { 

  const user = require("../controllers/user.controller.js"); 
  var router = require("express").Router(); 

  router.post("/", user.create); // router.Метод POST(в скобках указваем "путь",обработчик(функция из контроллера)
  router.get("/", user.findAll); // Получить все 
  router.get("/:id", user.findOne);// Получить одну по ID
  router.put("/:id", user.update); // Обновить одну по ID 
  router.delete("/:id", user.delete); // Удалить
  router.delete("/", user.deleteAll); // Удалить все

  app.use("/api/users", router);
};