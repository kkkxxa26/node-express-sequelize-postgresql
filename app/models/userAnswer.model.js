module.exports = (sequelize, Sequelize) => {
const userAnswers = sequelize.define ( "user_anserws", {

});
    userAnswers.associate = function(models){
        userAnswers.belongsTo(models.users,{foreignKey:'user_Id'});
        userAnswers.belongsTo(models.labBody,{foreignKey:'lab_body_Id'});
        userAnswers.belongsTo(models.labAnswer,{foreignKey:'lab_answers_Id'});
    }
    return userAnswers;
}
