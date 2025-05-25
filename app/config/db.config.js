module.exports = {//конфигурации подключения к PostgreSQL  через Sequelize
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "admin",
  DB: "testdb",
  dialect: "postgres",
  pool: { //настройки пула соединений
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

