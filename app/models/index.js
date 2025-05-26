
// подключение к самой базе данных
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

db.lections = require("./lections.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.labHead = require("./labHead.model.js")(sequelize, Sequelize);
db.labBody = require("./labBody.model.js")(sequelize, Sequelize);
db.labAnswer = require("./labAnswer.model.js")(sequelize, Sequelize);
db.userAnswer = require("./userAnswer.model.js")(sequelize, Sequelize);


Object.values(db).forEach(model=>{
  if(model.associate){
    model.associate(db);
  }
});

module.exports = db;
