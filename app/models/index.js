
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max, 
    min: dbConfig.pool.min, 
    acquire: dbConfig.pool.acquire, 
    idle: dbConfig.pool.idle 
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// импорт и инициализация model
db.lections = require("./lections.model.js")(sequelize,Sequelize); // lection model 
db.users = require("./users.model.js")(sequelize, Sequelize); // users model 
db.labHead = require("./labHead.model.js")(sequelize, Sequelize); // labHead model 
db.labBody = require("./labBody.model.js")(sequelize, Sequelize); // labBody model 
db.labAnswer = require("./labAnswer.model.js")(sequelize, Sequelize); // LabAnswer model 
db.userAnswer = require("./userAnswer.model.js")(sequelize, Sequelize); //userAnswer model 

Object.values(db).forEach(model=>{
  if(model.associate){
    model.associate(db); 
  }
});

module.exports = db;
