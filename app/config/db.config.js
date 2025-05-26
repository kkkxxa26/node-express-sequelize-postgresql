module.exports = { // Конфигурации подключения к PostgreSQL  через Sequelize
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "admin",
  DB: "testdb",
  dialect: "postgres",
  pool: { // Настройки пула соединений
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};

