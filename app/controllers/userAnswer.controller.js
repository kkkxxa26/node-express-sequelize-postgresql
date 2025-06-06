const db = require("../models");
//userAnswer 
const UserAnswer = db.userAnswer;
const Op = db.Sequelize.Op; 

exports.create = (req, res) => {  
  if (!req.body.lab_body_Id || !req.body.lab_answers_Id) { 
    res.status(400).send({
      message: "ниче нет"  
    });
    return;
  }
  const userAnswer = { 
    lab_body_Id: req.body.lab_body_Id, 
    lab_answers_Id: req.body.lab_answers_Id, 
    user_Id: req.user.id  

  };
  UserAnswer.create(userAnswer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Ошибка при создании лекции:", err);
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании."
      });
    });
};
