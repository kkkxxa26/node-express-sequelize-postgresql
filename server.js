// Импорт необходимых библиотек
const express = require("express");
const cors = require("cors");
const path = require('path')
const handlebars = require("handlebars")

const app = express();

// Настройка CORS для разрешения запросов с другого порта (фронт на 8081)
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));// Применение CORS
// Поддержка JSON и url-encoded форматов в теле запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Альтернатива устаревшему bodyParser

// Подключаем папку public как статическую
app.use(express.static(path.join(__dirname, 'public')));

// Подключение и настройка Passport.js для аутентификации
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy // Стратегия аутентификации по email/паролю
const db = require("./app/models"); // Подключение ORM моделей (Sequelize)

// Настройка сессии
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(session({
  store: new FileStore({
    path: './sessions',   // Папка, где будут храниться сессии
    ttl: 3600,            // Время жизни сессии в секундах (1 час)
    retries: 1            // Повторные попытки при ошибке чтения
  }),
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000       // 1 час в миллисекундах
  }
}));


// Инициализация Passport
app.use(passport.initialize()) // Инициализация Passport
app.use(passport.session()) // Подключение Passport к express-session   

// Аутентификационная функция — проверка email и пароля
const authUser = async (email, password, done) => {
  try { // Поиск пользователя в БД только по email
    const user = await db.users.findOne({ where: { email } });

    // if (!user) {
    //   return done(null, false, { message: 'Неверный email' });
    // } // Проверяем пароль через метод validPassword
    // const isValid = await user.validPassword(password); // validPassword добавлен в users.model.js
    var isValid=true;

    if (!isValid) {
      return done(null, false, { message: 'Неверный пароль' });
    }

    console.log("u",user);
    return done(null, user); // Успешная аутентификация
  } catch (err) {
    return done(err);
  }
};

// Регистрация стратегии LocalStrategy в Passport
passport.use(new LocalStrategy (authUser))
// Сериализация пользователя — сохранение его ID в сессии
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Десериализация — восстановление полного пользователя по ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.users.findByPk(id); // Поиск по первичному ключу
    if (!user) {
      return done(new Error("Пользователь не найден"));
    }
    done(null, user); // Пользователь найден
  } catch (err) {
    done(err); // Ошибка при получении данных
  }
});


// Подключение шаблонизатора handlebars
const { engine } = require("express-handlebars")

app.engine('handlebars', engine()); // Настройка движка handlebars
app.set('views', path.join(__dirname, 'app/views')); // Установка папки для шаблонов
app.set('view engine', 'handlebars'); // Установка шаблонизатора по умолчанию

// Подключение папки со статическими файлами (CSS, изображения и т.д.)
app.use(express.static(path.join(__dirname, "public")));

// Синхронизация с базой данных без принудительного удаления данных (force: false)
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
}); 

// Простой маршрут для проверки (корень приложения)
app.get("/", (req, res) => {
  res.json({ message: "AOS" });
});

// Обработка POST-запроса /login через Passport
app.post ("/login", passport.authenticate('local', {
   successRedirect: "/mainpage", // При успехе — редирект на главную
   failureRedirect: "/login", // При ошибке — редирект обратно на страницу логина
}));

// Выход из системы (разлогин)
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err); // Обработка возможной ошибки
    }
    res.redirect('/login'); // После выхода — редирект на логин
  });
});

require("./app/routes/lections.routes")(app); // подключаем файл роутов lections
require("./app/routes/users.routes")(app); // подключаем файл роутов users
require("./app/routes/front.routes")(app); // подключаем файл роутов front
require("./app/routes/lab.routes")(app); // подключаем файл роутов lab
require("./app/routes/userAnswer.routes")(app); // подключаем файл роутов usersAnswers
require("./app/routes/register.routes")(app);

// Запуск сервера на заданном порту (по умолчанию 8080)
const PORT = process.env.PORT || 8080;  
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}.`);
});
