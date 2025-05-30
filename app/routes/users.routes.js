module.exports = app => { 

  const user = require("../controllers/user.controller.js"); 
  var router = require("express").Router(); 

  router.post("/", user.create); // Создать пользователя
  router.get("/", user.findAll); // Получить всех пользователей
  router.get("/:id", user.findOne);// Получить одного пользователя по ID
  router.put("/:id", user.update); // Обновить одного пользователя по ID 
  router.delete("/:id", user.delete); // Удалить одного пользователя по ID 
  router.delete("/", user.deleteAll); // Удалить всех

  app.use("/api/users", router);
};