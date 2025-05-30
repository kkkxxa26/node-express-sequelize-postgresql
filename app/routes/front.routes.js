module.exports = app => {
  const front = require("../controllers/front.controller.js");

  var router = require("express").Router();

  router.get("/login", front.renderMain); // Страница входа
  router.get("/register", front.renderReg); // Страница регистрации
  router.get("/mainpage", front.renderMP); // Главная страница после входа
  router.get("/tests", front.renderTests); // Страница с тестами
  router.get("/lection", front.renderLections); // Страница с лекциями
  router.get("/adminka", front.renderAdminka); // Административная панель

  app.use(router); // Подключение маршрутов к приложению
};
