const db = require("../models");
const UserAnswer = db.userAnswer;
const Op = db.Sequelize.Op; 

// lection это объект(запись) с информацией об одной лекции 
// Lections это модель таблицы которая ее описывает в бд

exports.create = (req, res) => { //"/", lections.create 
  // Валидация request
  if (!req.body.lab_body_Id || !req.body.lab_answers_Id) { 
    res.status(400).send({ // то выводим статус 400(ошибка) с сообщением 
      message: "ниче нет" //само соообщение 
    });
    return;
  }

  // иначе создаем объект lection с полями 
  const userAnswer = { 
    lab_body_Id: req.body.lab_body_Id, //поля lection
    lab_answers_Id: req.body.lab_answers_Id, //поля lection
    user_Id: req.user.id  //поля lection

  };

// Сохраняем Lections в бд
  UserAnswer.create(userAnswer) // create в готовой базе создаем строчку 
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
