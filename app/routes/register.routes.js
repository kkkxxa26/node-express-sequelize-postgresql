module.exports = app => {

  const express = require("express");
  const { registerUser } = require("../controllers/register.controller");

  const router = express.Router();
  router.post("/register", registerUser);  // Обработка POST-запроса на регистрацию

  app.use("/", router); // Подключение маршрутов к приложению
};



