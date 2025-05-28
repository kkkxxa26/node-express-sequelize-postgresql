const db = require("../models");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, surname, email, password, phoneNumber, birthDate, gender } = req.body;

    // Валидация данных
    if (!name || !surname || !email || !password || !phoneNumber || !birthDate || !gender) {
      return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Неверный формат email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" });
    }

    const existingUser = await db.users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Пользователь с таким email уже существует" });
    }

    const newUser = await db.users.create({
      name,
      surname,
      email,
      password,
      phoneNumber,
      birthDate,
      gender
    });

    req.login(newUser, err => {
      if (err) return next(err);

      const userResponse = { ...newUser.toJSON() };
      delete userResponse.password;

      return res.status(201).json({
        message: "Регистрация прошла успешно",
        user: userResponse
      });
    });

  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
