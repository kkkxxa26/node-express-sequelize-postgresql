module.exports = app => {
  const lections = require("../controllers/lection.controller.js");
  var router = require("express").Router(); 

  router.post("/", lections.create); // Создать новую лекцию
  router.get("/:id", lections.findOne);// Получить одну лекцию по ID
  router.get("/", lections.findAll);
  router.put("/:id", lections.update); // Обновить лекцию по ID     
  router.delete("/:id", lections.delete);// Удалить     
  router.delete("/", lections.deleteAll);// Удалить все  

  app.use("/api/lections", router); 
};

