//Sequelize  — это ORM (Object-Relational Mapper) инструмент, который связывает объекты в коде с таблицами в бд
//sequelize это экземпляр подключения к БД через ORM Sequelize
//Sequelize это сам класс, из которого берутся типы данных и методы
module.exports = (sequelize, Sequelize) => {//экспорт функции, которая принимает
const userAnswers = sequelize.define ( "user_anserws", {


});

userAnswers.associate = function(models){
    userAnswers.belongsTo(models.users,{foreignKey:'user_Id'});
    userAnswers.belongsTo(models.labBody,{foreignKey:'lab_body_Id'});
    userAnswers.belongsTo(models.labAnswer,{foreignKey:'lab_answers_Id'});
}


     return userAnswers;
    // делаем return, чтобы её можно было потом использовать в контроллерах и сервере
}
