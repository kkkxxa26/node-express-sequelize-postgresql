const db = require("../models");

//_______________________________ lection _______________________________

const Lections = db.lections;
const Op = db.Sequelize.Op; 

exports.create = (req, res) => {
  console.log("Тело запроса:", req.body); 

  if (!req.body.title || !req.body.content) {
    res.status(400).send({ message: "ниче нет" });
    return;
  }

  const lection = {
    title: req.body.title,
    content: req.body.content
  };

  Lections.create(lection)
    .then(data => res.send(data))
    .catch(err => {
      console.error("Ошибка при создании лекции:", err);
      res.status(500).send({
        message: err.message || "Произошла ошибка при создании."
      });
    });
};

// Получить все лекции из бд
// router.get("/", lections.findAll);
exports.findAll = (req, res) => { 
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Lections.findAll({ where: condition }) 
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Не удалось загрузить лекции."
      });
    });
};

// Получить одну лекцию по ID
// router.get("/:id", lections.findOne);
exports.findOne = (req, res) => {
  const id = req.params.id; 
  console.log(req.params, "Получить одну лекцию по ID");
  
  Lections.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data); 
      } else { 
        res.status(404).send({  
          message: `Лекция с ID=${id} не найдена` 
        });
      }
    })
    .catch(err => {
      res.status(500).send({ 
        message: `Ошибка при получении лекции с ID = ${id}`
      });
    });
};

// Обновить лекцию по ID 
// router.put("/:id", lections.update);  
exports.update = (req, res) => { 
  const id = req.params.id; 

  Lections.update(req.body, { 
    where: { id: id } 
  })
    .then(num => {
      if (num == 1) { 
        res.send({ message: "Лекция успешно обновлена" });
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

// Удалить лекцию по ID 
// router.delete("/:id", lections.delete);      
exports.delete = (req, res) => {
  const id = req.params.id; 

  if (isNaN(id)) {
    return res.status(400).send({ 
      message: "ID должен быть числом" 
    });
  }

  const lectureId = parseInt(id); 
  Lections.destroy({ 
    where: { id: lectureId }
  })
    .then(num => {
      if (num == 1) { 
        res.send({ message: "Лекция успешно удалена" });
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

  // Удалить все записи(лекции) из бд 
  // router.delete("/", lections.deleteAll);   
exports.deleteAll = (req, res) => {
  Lections.destroy({ 
    where: {}, 
    truncate: false 
  })
    .then(nums => { 
      res.send({ message: `${nums} лекций было удалено` }); 
    })
    .catch(err => { 
      res.status(500).send({ 
        message: "Ошибка при удалении всех лекций"  
      });
    });
};