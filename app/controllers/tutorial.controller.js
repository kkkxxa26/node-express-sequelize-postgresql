
// это класс controller где мы прописываем функции относящиеся к этому модулю
// пример контроллера
const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial

// req запрос - запрашиваем все данные которые есть 
// между обрабатываем и отправляем их в res 
// res ответ 

//exports экспорируем функцию из другого файла что бы другие файлы могли его использовать 
exports.create = (req, res) => {
  // Валидация request
  if (!req.body.title) { // если в req.body нет! title 
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Создаем Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false 
  };

  // Сохраняем Tutorial в database(db)
  Tutorial.create(tutorial) // create в готовой базе создаем строчку 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};


// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title; // query 
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Tutorial.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id; // достаем id из парамтеров(params) req(сам запрос откуда приходят все данные)

  Tutorial.findByPk(id) //byPK primary key т.е. первичный ключ 
    .then(data => {
      if (data) { // if проверка
        res.send(data); 
      } else {
        res.status(404).send({ // не нешел такой 
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ // 500 ошибка при выполнение запроса 
        message: "Error retrieving Tutorial with id=" + id 
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tutorial.update(req.body, { // обновляем запись в бд
    where: { id: id }   // где id( по какому столбцу обновляем):id(значение с которым мы сверяеся) 
  })
  // id уникальное значение которое не может повторяться поэтому 0/1
    .then(num => { // в данном параметре получаем количество обновленных сток 
      if (num == 1) { // if одна строка была успешно обновлена
        res.send({ // по умолчанию статус 200 это успешно поэтому не указываем статус
          message: "Tutorial was updated successfully."
        });
      } else { // 0 в случае, если ни одна строка не была обновлена
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => { // статус 500 ошибка при выполнение запроса 
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// удаление из Tutorials из database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false // false удаляет все кроме истории а true удялает все вместе с историей все в общем 
  })
    .then(nums => { // 200 
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({ // 500 
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: req.query.published ? req.query.published : true  } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}


