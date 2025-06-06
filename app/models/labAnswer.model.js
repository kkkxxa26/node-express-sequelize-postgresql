module.exports = (sequelize, Sequelize) => {
    const LabAnswer = sequelize.define ( "lab_answers", {
        title: { 
            type: Sequelize.STRING
        },
        check: { 
            type: Sequelize.BOOLEAN 
        }
    });
    
    LabAnswer.associate = function(db){
        LabAnswer.belongsTo(db.users,{foreignKey:'lab_body_Id'});
    }
    return LabAnswer;
}
