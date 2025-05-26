// Загружаем настройки подключения к базе данных из внешнего конфигурационного файла
const dbConfig = require("../config/db.config.js");

// Подключаем Sequelize — ORM для Node.js
const Sequelize = require("sequelize");

// Создаём экземпляр Sequelize с параметрами из db.config.js
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect, // 'postgres'
  pool: {
    max: dbConfig.pool.max, // Мах подключений в пуле
    min: dbConfig.pool.min, // Мин подключений
    acquire: dbConfig.pool.acquire, // Время ожидания (мс) перед ошибкой подключения
    idle: dbConfig.pool.idle // Время простоя перед закрытием соединения
  },
});

// Объект, содержащий все модели и Sequelize
const db = {};

// Сохраняем Sequelize и его инстанс в объекте db
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт и инициализация model
db.lections = require("./lections.model.js")(sequelize, Sequelize); // lection model 
db.users = require("./users.model.js")(sequelize, Sequelize); // users model 
db.labHead = require("./labHead.model.js")(sequelize, Sequelize); // labHead model 
db.labBody = require("./labBody.model.js")(sequelize, Sequelize); // labBody model 
db.labAnswer = require("./labAnswer.model.js")(sequelize, Sequelize); // LabAnswer model 
db.userAnswer = require("./userAnswer.model.js")(sequelize, Sequelize); //userAnswer model 

// Исрользуется если в модели определены связи (например, hasMany, belongsTo), то вызываем их
Object.values(db).forEach(model=>{
  if(model.associate){
    model.associate(db); // передаём весь объект db для связи между моделями
  }
});

// Экспортируем объект db для использования в других частях приложения
module.exports = db;
