
// модель т.е. сама структура табл, сама таблица в которой будут хранится данные 
// описываем таблицу, какие столбцы там должны быть 
// пример просто

module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", { // название 
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    },
    author: {
      type: Sequelize.STRING
    }
  });

  return Tutorial;
};
