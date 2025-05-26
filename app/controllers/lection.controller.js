const db = require("../models");
const Lections = db.lections;
const Op = db.Sequelize.Op; 

// lection это объект(запись) с информацией об одной лекции 
// Lections это модель таблицы которая ее описывает в бд

//_______________________________ lection _______________________________

exports.create = (req, res) => { // "/", lections.create 
  // Валидация request
  if (!req.body.title || !req.body.content) { // если в req.body !(нет) title || content
    res.status(400).send({ // то выводим статус 400(ошибка) с сообщением 
      message: "ниче нет" //само соообщение 
    });
    return;
  }

  // иначе создаем объект lection с полями 
  const lection = { 
    title: req.body.title, //поля lection
    content: req.body.content //поля lection
  };

// Сохраняем Lections в бд
  Lections.create(lection) // create в готовой базе создаем строчку 
    .then(data => {
      res.send(data);
    })
    .catch(err => {//иначе попадаем в .catch()
      console.error("Ошибка при создании лекции:", err); // выводим ошибку в консоль
      res.status(500).send({//выдаем ответ с кодом 500 и сообщением 
        message://сообщение которое мы выодим
          err.message || "Произошла ошибка при создании."
      });
    });
};

// Получить все лекции из бд
// router.get("/", lections.findAll);
exports.findAll = (req, res) => {  // .findAll()—получаем все записи, подходящие под условие
  const title = req.query.title; // query - есть ли параметр title в строке запроса
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Lections.findAll({ where: condition }) 
    .then(data => {
      res.send(data); // если данные успешно получены отправляем их
    })
    .catch(err => {
      res.status(500).send({ //если произошла ошибка тправляем статус 500 и сообщение об ошибке
        message:
          err.message || "Не удалось загрузить лекции."// сообщение
      });
    });
};

// Получить одну лекцию по ID
// router.get("/:id", lections.findOne);
exports.findOne = (req, res) => {
  const id = req.params.id; // получаемм id из парамтеров(params) req(сам запрос откуда приходят все данные)
  console.log(req.params, 111); //логируем 
  
  Lections.findByPk(id) // ищем запись в базе данных по Primary Key
    .then(data => {
      if (data) { // если
        res.send(data); // запись успешно найдена отправляем их
      } else { // если, запись НЕ найдена 
        res.status(404).send({ // возвращаем статус 500 
          message: `Лекция с ID=${id} не найдена` // и сообщение об ошибке
        });
      }
    })
    .catch(err => { // в противном случае при ошибке на сервере 
      res.status(500).send({ // возвращаем статус 500
        message: `Ошибка при получении лекции с ID = ${id}` // и сообщение об ошибке
      });
    });
};

// Обновить лекцию по ID 
// router.put("/:id", lections.update);  
exports.update = (req, res) => { 
  const id = req.params.id; 

  Lections.update(req.body, { // обновляем запись(лекцию) в бд
    where: { id: id } // где id(по какому столбцу обновляем):id(значение с которым мы сверяеся)
  })
    .then(num => { // в данном параметре получаем количество обновленных строк в бд
      if (num == 1) { // if одна(n-количество) строка была успешно обновлена
        res.send({ message: "Лекция успешно обновлена" });
        // по умолчанию статус 200 это успешно поэтому не указываем статус
      } else { // 0 в случае, если ни одна строка не была обновлена
        res.status(404).send({ message: `Не удалось обновить лекцию с ID=${id}` });
      }
    })
    .catch(err => { // в противном случае при ошибке на сервере 
      res.status(500).send({ // возвращаем статус 500
        message: `Ошибка при обновлении лекции с ID=${id}` // и сообщение об ошибке
      });
    });
};

  // Удалить лекцию по ID 
  // router.delete("/:id", lections.delete);      
  exports.delete = (req, res) => {
  const id = req.params.id; // получаем ID из параметра
  
  if (isNaN(id)) { // // проверка, является ли ID числом
    return res.status(400).send({ // если НЕ число возвращаем статус 400
      message: "ID должен быть числом" // // и сообщение об ошибке
    });
  }

  const lectureId = parseInt(id); // преобразуем ID в число (потому что из URL он приходит как строка)

  Lections.destroy({ // удаляем запись из бд по ID
    where: { id: lectureId }  // где id(по какому столбцу обновляем):id(значение с которым мы сверяеся)
  })
    .then(num => {
      if (num == 1) { // если запись была удалена 1
        res.send({ message: "Лекция успешно удалена" });
      } else { // если запись НЕ найдена возвращаем статус 404
        res.status(404).send({ message: `Лекция с ID=${id} не найдена` }); // и сообщение
      }
    })
    .catch(err => { // в противном случае при ошибке на сервере
      res.status(500).send({ // возвращаем статус 500
        message: `Ошибка при удалении лекции с ID=${id}` // и сообщение об ошибке
      });
    });
};

  // Удалить все записи(лекции) из бд 
  // router.delete("/", lections.deleteAll);   
  exports.deleteAll = (req, res) => {
  Lections.destroy({ // удалить все 
    where: {}, // условие "пустое" т.к. хотим удалить всё
    truncate: false // false удаляет все кроме истории а true удялает все вместе с историей все в общем
  })
    .then(nums => { // если все было удалено
      res.send({ message: `${nums} лекций было удалено` });  // и сообщение
    })
    .catch(err => { // в противном случае при ошибке на сервере
      res.status(500).send({ // возвращаем статус 500
        message: "Ошибка при удалении всех лекций"  // и сообщение об ошибке
      });
    });
};