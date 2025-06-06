module.exports = (sequelize, Sequelize) => {//экспорт функции, которая принимает
const Lections = sequelize.define ( "lections", {//определяем модель Lections
    title: {//название поля 
        type: Sequelize.STRING// тип
    },
    content: {
        type: Sequelize.STRING
    }
});
     return Lections;
}
