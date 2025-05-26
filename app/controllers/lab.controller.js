const db = require("../models");
//controller Head/Body/Answers
const LabHead = db.labHead;
const LabBody = db.labBody;
const LabAnswers= db.labAnswer;
const Op = db.Sequelize.Op; 


//_______________________________ Head_______________________________

exports.createHead = (req, res) => { 
  // Валидация request
  if (!req.body.title) { // если в req.body !(нет) title || content
    res.status(400).send({ // то выводим статус 400(ошибка) с сообщением 
      message: "ниче нет" //само соообщение 
    });
    return;
  }

  // иначе создаем объект с полями 
  const item = { 
    title: req.body.title
  };

// Сохраняем в бд
  LabHead.create(item) // create в готовой базе создаем строчку 
    .then(data => {
      res.send(data);
    })
    .catch(err => {//иначе попадаем в .catch()
      console.error("Ошибка при создании:", err); // выводим ошибку в консоль
      res.status(500).send({//выдаем ответ с кодом 500 и сообщением 
        message://сообщение которое мы выодим
          err.message || "Произошла ошибка при создании."
      });
    });
};

exports.findAllHead = async (req, res) => {
  try {
    const title = req.query.title;
    const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : {};
    const user = req.user;

    const data = await LabHead.findAll({ where: condition });

    // Если пользователь авторизован — делаем доп. вычисления
    if (user) {
      const user_id = user.id;

      // Обходим полученные записи и делаем асинхронные запросы
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const result = await db.sequelize.query(`
          SELECT 
            COUNT(DISTINCT lb.id) AS total_a,
            COUNT(DISTINCT CASE 
              WHEN la.id = lu."lab_answers_Id" THEN lb.id 
              ELSE NULL 
            END) AS right_a
          FROM lab_bodies lb
          JOIN lab_answers la ON lb.id = la."lab_body_Id" AND la.check = true
          LEFT JOIN user_anserws lu ON lb.id = lu."lab_body_Id" AND lu."user_Id" = :user_id
          WHERE lb."lab_head_Id" = :head_id`, {
          replacements: { user_id, head_id: element.id },
          type: db.Sequelize.QueryTypes.SELECT
        });

        // Результат — это массив из одного объекта
        const counter = result[0];
        element.dataValues.info = {
          total: counter.total_a,
          right: counter.right_a
        };
      }
    }
    // Возвращаем данные (с info, если был пользователь)
    res.send(data);

  } catch (err) {
    res.status(500).send({
      message: err.message || "Не удалось загрузить данные."
    });
  }
};

exports.findOneHead = (req, res) => {
  const id = req.params.id; // получаемм id из парамтеров(params) req(сам запрос откуда приходят все данные)
  
LabHead.findByPk(id,{
  include: [{
    model: db.labBody,
    include: [{
      model: db.labAnswer
    }]
  }]
}) // ищем запись в базе данных по Primary Key
    .then(data => {
      if (data) { // если
        res.send(data); // запись успешно найдена отправляем их
      } else { // если, запись НЕ найдена 
        res.status(404).send({ // возвращаем статус 500 
          message: ` с ID=${id} не найдена` // и сообщение об ошибке
        });
      }
    })
    .catch(err => { // в противном случае при ошибке на сервере 
      res.status(500).send({ // возвращаем статус 500
        message: `Ошибка при получении с ID = ${id}` // и сообщение об ошибке
      });
    });
};

exports.updateHead = (req, res) => { 
  const id = req.params.id; 

  LabHead.update(req.body, { // обновляем запись в бд
    where: { id : id } // где id(по какому столбцу обновляем):id(значение с которым мы сверяеся)
  })
    .then(num => { // в данном параметре получаем количество обновленных строк в бд
      if (num == 1) { // if одна(n-количество) строка была успешно обновлена
        res.send({ message: "успешно обновлена" });
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

exports.deleteHead = (req, res) => {
  const id = req.params.id; // получаем ID из параметра
  
  if (isNaN(id)) { // // проверка, является ли ID числом
    return res.status(400).send({ // если НЕ число возвращаем статус 400
      message: "ID должен быть числом" // // и сообщение об ошибке
    });
  }

  const Id = parseInt(id); // преобразуем ID в число (потому что из URL он приходит как строка)

  LabHead.destroy({ // удаляем запись из бд по ID
    where: { id: Id }  // где id(по какому столбцу обновляем):id(значение с которым мы сверяеся)
  })
    .then(num => {
      if (num == 1) { // если запись была удалена 1
        res.send({ message: " успешно удалена" });
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


//_______________________________ Body _______________________________
exports.createBody = (req, res) => { 
  // Валидация request
  if (!req.body.title || !req.body.head_id) { 
    res.status(400).send({ 
      message: "ниче нет"
    });
    return;
  }

  const item = { 
    title: req.body.title,
    lab_head_Id: req.body.head_id
  };


  LabBody.create(item) 
    .then(data => {
      res.send(data);
    })
    .catch(err => {//иначе попадаем в .catch()
      console.error("Ошибка при создании:", err); // выводим ошибку в консоль
      res.status(500).send({//выдаем ответ с кодом 500 и сообщением 
        message://сообщение которое мы выодим
          err.message || "Произошла ошибка при создании."
      });
    });
};

exports.findAllBody = (req, res) => { 
  const head_id = req.query.head_id; 
  var condition = head_id ? { lab_head_id: { [Op.iLike]: `%${head_id}%` } } : null;

  LabBody.findAll({ where: condition }) 
    .then(data => {
      res.send(data); // если данные успешно получены отправляем их
    })
    .catch(err => {
      res.status(500).send({ //если произошла ошибка тправляем статус 500 и сообщение об ошибке
        message:
          err.message || "Не удалось загрузить ."// сообщение
      });
    });
};

exports.updateBody = (req, res) => { 
  const id = req.params.id; 

  LabBody.update(req.body, { 
    where: { id : id } 
  })
    .then(num => { 
      if (num == 1) { 
        res.send({ message: "успешно обновлена" });
      } else { 
        res.status(404).send({ message: `Не удалось обновить лекцию с ID=${id}` });
      }
    })
    .catch(err => {  
      res.status(500).send({
        message: `Ошибка при обновлении лекции с ID=${id}` 
      });
    });
};

exports.deleteBody = (req, res) => {
  const id = req.params.id; 
  
  if (isNaN(id)) { 
    return res.status(400).send({ 
      message: "ID должен быть числом" 
    });
  }

  const Id = parseInt(id); 

  LabBody.destroy({ 
    where: { id: Id } 
  })
    .then(num => {
      if (num == 1) { 
        res.send({ message: " успешно удалена" });
      } else { 
        res.status(404).send({ message: `Лекция с ID=${id} не найдена` });
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: `Ошибка при удалении лекции с ID=${id}` 
      });
    });
};

//_______________________________ Answers _______________________________

exports.createAnswers = (req, res) => { 
  // Валидация request
  if (!req.body.title || !req.body.check || !req.body.lab_body_id) { 
    res.status(400).send({ 
      message: "ниче нет"
    });
    return;
  }

  const item = { 
    title: req.body.title,
    check: req.body.check,
    lab_body_Id: req.body.lab_body_id
  };

  LabAnswers.create(item) 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Ошибка при создании:", err); 
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании."
      });
    });
};

exports.findAllAnswer = (req, res) => { 
  const body_id = req.query.body_id; 
  var condition = body_id ? { lab_body_id: { [Op.iLike]: `%${body_id}%` } } : null;

  LabAnswer.findAll({ where: condition }) 
    .then(data => {
      res.send(data); 
    })
    .catch(err => {
      res.status(500).send({ 
        message:
          err.message || "Не удалось загрузить ."
      });
    });
};

exports.updateAnswer = (req, res) => { 
  const id = req.params.id; 

  LabAnswer.update(req.body, { 
    where: { id : id } 
  })
    .then(num => {
      if (num == 1) { 
        res.send({ message: "успешно обновлена" });
      } else { 
        res.status(404).send({ message: `Не удалось обновить с ID=${id}` });
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: `Ошибка при обновлении лекции с ID=${id}` 
      });
    });
};

exports.deleteAnswer = (req, res) => {
  const id = req.params.id; 
  
  if (isNaN(id)) {
    return res.status(400).send({ 
      message: "ID должен быть числом" 
    });
  }

  const Id = parseInt(id); 
  LabAnswer.destroy({ 
    where: { id: Id }  
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: " успешно удалена" });
      } else { 
        res.status(404).send({ message: `Лекция с ID=${id} не найдена` }); 
      }
    })
    .catch(err => { 
      res.status(500).send({
        message: `Ошибка при удалении лекции с ID=${id}` 
      });
    });
};


