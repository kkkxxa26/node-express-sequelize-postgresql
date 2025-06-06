const db = require("../models");
//controller Head/Body/Answers 
const LabHead = db.labHead;
const LabBody = db.labBody; 
const LabAnswers = db.labAnswer;
const Op = db.Sequelize.Op;

//_______________________________ Head _______________________________

exports.createHead = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      message: "Отсутствует обязательное поле"
    });
    return;
  }

  const item = {
    title: req.body.title
  };

  LabHead.create(item)
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

exports.findAllHead = async (req, res) => {
  try {
    const title = req.query.title;
    const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : {};
    const user = req.user;
    const data = await LabHead.findAll({ where: condition });

    if (user) {
      const user_id = user.id;
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
        const counter = result[0];
        data[i].dataValues.info = {
          total: counter.total_a,
          right: counter.right_a
        };
      }
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Не удалось загрузить данные."
    });
  }
};

exports.findOneHead = (req, res) => {
  const id = req.params.id;
  LabHead.findByPk(id, {
    include: [{
      model: db.labBody,
      include: [{
        model: db.labAnswer
      }]
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `с ID=${id} не найдена`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при получении с ID = ${id}`
      });
    });
};

exports.updateHead = (req, res) => {
  const id = req.params.id;
  LabHead.update(req.body, {
    where: { id: id }
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

exports.deleteHead = (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).send({
      message: "ID должен быть числом"
    });
  }

  const Id = parseInt(id);
  LabHead.destroy({
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


exports.getUserAnswersStats = async (req, res) => {
  try {
    const rawResults = await db.sequelize.query(`
      SELECT 
        u.id AS user_id,
        u.name,
        lh.title AS test_title,
        COUNT(DISTINCT lb.id) AS total_a,
        COUNT(DISTINCT CASE 
          WHEN la.id = ua."lab_answers_Id" THEN lb.id 
          ELSE NULL 
        END) AS right_a
      FROM lab_bodies lb
      JOIN lab_answers la 
        ON lb.id = la."lab_body_Id" AND la.check = true
      LEFT JOIN user_anserws ua 
        ON lb.id = ua."lab_body_Id"
      JOIN users u ON ua."user_Id" = u.id
      JOIN lab_heads lh ON lb."lab_head_Id" = lh.id
      WHERE ua."user_Id" IS NOT NULL
      GROUP BY u.id, u.name, lh.title
      ORDER BY u.name, lh.title
    `, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    const table = {};
    const testSet = new Set();
    rawResults.forEach(row => {
      if (!table[row.name]) {
        table[row.name] = {};
      }
      table[row.name][row.test_title] = `${row.right_a}/${row.total_a}`;
      testSet.add(row.test_title);
    });

    res.json({
      tests: Array.from(testSet),
      users: Object.keys(table),
      data: table
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Ошибка при получении статистики ответов."
    });
  }
};

//_______________________________ Body _______________________________

exports.createBody = (req, res) => {
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
    .catch(err => {
      console.error("Ошибка при создании:", err);
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании."
      });
    });
};

exports.findAllBody = (req, res) => {
  const head_id = req.query.head_id;
  const condition = head_id ? { lab_head_Id: head_id } : {};

  LabBody.findAll({ where: condition })
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

exports.findOneBody = (req, res) => {
  const id = req.params.id;
  LabBody.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({ message: `Вопрос с ID=${id} не найден.` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Ошибка при получении вопроса с ID=${id}.`
      });
    });
};

exports.updateBody = (req, res) => {
  const id = req.params.id;
  LabBody.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "успешно обновлена" });
      } else {
        res.status(404).send({ message: `Не удалось обновить вопрос с ID=${id}` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при обновлении вопроса с ID=${id}`
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
  if (!req.body.title || req.body.lab_body_id === undefined || req.body.check === undefined) {
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
  const condition = body_id ? { lab_body_Id: body_id } : {};

  LabAnswers.findAll({ where: condition })
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
  LabAnswers.update(req.body, {
    where: { id: id }
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
  LabAnswers.destroy({
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