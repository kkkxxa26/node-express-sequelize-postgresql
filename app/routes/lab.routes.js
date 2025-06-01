module.exports = app => {
  const lab = require("../controllers/lab.controller.js"); 
  var router = require("express").Router(); 

  // Получение данных
  router.get("/allHead", lab.findAllHead);           // Получить все заголовки заданий
  router.get("/oneHead/:id", lab.findOneHead);       // Получить один заголовок по ID
  router.get("/allBody", lab.findAllBody);           // Получить все тела заданий
  router.get("/allAnswer", lab.findAllAnswer);       // Получить все ответы
  router.get("/user-stats", lab.getUserAnswersStats);

  // Создание данных
  router.post("/head", lab.createHead);              // Создать заголовок задания
  router.post("/body", lab.createBody);              // Создать тело задания
  router.post("/answer", lab.createAnswers);         // Добавить варианты ответов

  // Обновление данных
  router.put("/head/:id", lab.updateHead);           // Обновить заголовок задания
  router.put("/body/:id", lab.updateBody);           // Обновить тело задания
  router.put("/answer/:id", lab.updateAnswer);       // Обновить ответ

  // Удаление данных
  router.delete("/head/:id", lab.deleteHead);        // Удалить заголовок
  router.delete("/body/:id", lab.deleteBody);        // Удалить тело задания
  router.delete("/answer/:id", lab.deleteAnswer);    // Удалить ответ

  // Префикс маршрутов
  app.use("/api/lab", router); 
};
