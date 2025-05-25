//Sequelize  — это ORM (Object-Relational Mapper) инструмент, который связывает объекты в коде с таблицами в бд
//sequelize это экземпляр подключения к БД через ORM Sequelize
//Sequelize это сам класс, из которого берутся типы данных и методы
module.exports = (sequelize, Sequelize) => {//экспорт функции, которая принимает
const LabHead = sequelize.define ( "lab_head", {//определяем модель Lections
//модель Lections , который описывает таблицу в бд
    title: { // название поля 
        type: Sequelize.STRING//и его тип
    }
    // id; createdAt ; updatedAt автоматически создаваемые поля  в Sequelize
    // которые добавляются к каждой модели по умолчанию и не требуют явного объявления
});

LabHead.associate = function(models){
    LabHead.hasMany(models.labBody,{foreignKey:'lab_head_Id'});
}


     return LabHead;
    // делаем return, чтобы её можно было потом использовать в контроллерах и сервере
}
