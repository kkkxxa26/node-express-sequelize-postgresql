const db = require("../models");
// user 
const Users = db.users;
const Op = db.Sequelize.Op; 

exports.create = (req, res) => { //"/", users.create 
  // Валидация request
  if (!req.body.email || !req.body.name) { 
    res.status(400).send({ 
      message: "ниче нет" 
    });
    return;
  }

  const user = { 
    email: req.body.email, //поля 
    password: req.body.password,
    name: req.body.name, //поля 
    surname: req.body.surname, //поля 
    phoneNumber: req.body.phoneNumber, //поля
    birthDate: req.body.birthDate,
    gender: req.body.gender,
    role: req.body.role
  };    

  Users.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Ошибка при создании пользователя:", err); 
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании пользователя."
      });
    });
};

 // Получить все  
 //   router.get("/", user.findAll); // Получить все 
exports.findAll = (req, res) => {
  const email = req.query.email;
  const condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

  Users.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ошибка при получении списка пользователей"
      });
    });
};

// Получить одну по ID
// router.get("/:id", user.findOne);// Получить одну по ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Пользователь с ID=${id} не найден`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка при получении пользователя с ID=" + id
      });
    });
};

// Обновить по ID 
// router.put("/:id", user.update); // Обновить одну по ID  
exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body.email || !req.body.name) {
    return res.status(400).send({
      message: "Поля 'email' и 'name' обязательны для заполнения"
    });
  }

  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    phoneNumber: req.body.phoneNumber,
    birthDate: req.body.birthDate,
    gender: req.body.gender,
    role: req.body.role
  };

  Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
  Users.update(user, {
    where: { id: id }
  })
    .then(num => {
      if (num[0] === 1) {
        res.send({ message: "Пользователь успешно обновлён" });
      } else {
        res.status(404).send({
          message: `Не удалось обновить пользователя с ID=${id}. Возможно, пользователь не найден.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка при обновлении пользователя с ID=" + id
      });
    });
};

// Удалить
// router.delete("/:id", user.delete); // Удалить      
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({ message: "Пользователь успешно удалён" });
      } else {
        res.status(404).send({
          message: `Не удалось удалить пользователя с ID=${id}. Возможно, пользователь не найден.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка при удалении пользователя с ID=" + id
      });
    });
};

// Удалить все
// router.delete("/", user.deleteAll); // Удалить все
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} пользователей удалено` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ошибка при удалении всех пользователей"
      });
    });
};
