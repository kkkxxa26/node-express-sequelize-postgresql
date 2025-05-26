const express = require("express");
const cors = require("cors");
const path = require('path')
const handlebars = require("handlebars")

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

//passport 
const passport = require('passport')
const session = require('express-session')
//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy
const db = require("./app/models");

app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
// This is the basic express session({..}) initialization.
app.use(passport.initialize()) 
// init passport on every route call.
app.use(passport.session())    
// allow passport to use "express-session".

const authUser = async (email, password, done) => {
  try {
    const user = await db.users.findOne({ where: { email, password } });

    if (!user) {
      return done(null, false, { message: 'Неверный email или пароль' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy (authUser))

// Сохраняем пользователя в сессии (по ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Восстанавливаем пользователя по ID и загружаем все поля
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.users.findByPk(id);
    if (!user) {
      return done(new Error("Пользователь не найден"));
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const { engine } = require("express-handlebars")

app.engine('handlebars', engine())
app.set('views', path.join(__dirname, 'app/views'));//quand j'utilise res.render('templatename) ça regardera directement dans le /views
app.set('view engine', 'handlebars');

//css
app.use(express.static(path.join(__dirname, "public")))

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
}); 

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.post ("/login", passport.authenticate('local', {
   successRedirect: "/mainpage",
   failureRedirect: "/login",
}))

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/login'); // После выхода — редирект на логин
  });
});

require("./app/routes/lections.routes")(app); // подключаем файл роутов lections
require("./app/routes/users.routes")(app); // подключаем файл роутов users
require("./app/routes/front.routes")(app); // подключаем файл роутов front
require("./app/routes/lab.routes")(app); // подключаем файл роутов lab
require("./app/routes/userAnswer.routes")(app); // подключаем файл роутов usersAnswers

// set port, listen for requests
const PORT = process.env.PORT || 8080;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
