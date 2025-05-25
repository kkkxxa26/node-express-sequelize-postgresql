//Sequelize  — это ORM (Object-Relational Mapper) инструмент, который связывает объекты в коде с таблицами в бд
//sequelize это экземпляр подключения к БД через ORM Sequelize
//Sequelize это сам класс, из которого берутся типы данных и методы
module.exports = (sequelize, Sequelize) => {//экспорт функции, которая принимает
const Users = sequelize.define ( "user", {//определяем модель 
//модель Lections , который описывает таблицу в бд

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isPassword: true }
    },
    name: { // название поля 
        type: Sequelize.STRING//и его тип
    },
    surname: {
        type: Sequelize.STRING
    },
    phoneNumber: {
        type: Sequelize.STRING
    },
    birthDate:{
        type: Sequelize.DATE
    },
    gender: {
      type: Sequelize.STRING,
      values: ['male', 'female', 'other']
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user'
    }

    // id; createdAt ; updatedAt автоматически создаваемые поля  в Sequelize
    // которые добавляются к каждой модели по умолчанию и не требуют явного объявления
});
     return Users;
    // делаем return, чтобы её можно было потом использовать в контроллерах и сервере
}
