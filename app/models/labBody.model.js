module.exports = (sequelize, Sequelize) => {
const LabBody = sequelize.define ( "lab_body", {
    title: {
        type: Sequelize.STRING
    },
});

LabBody.associate = function(models){
    LabBody.belongsTo(models.labHead,{foreignKey:'lab_head_Id'});
}

LabBody.associate = function(models){
    LabBody.hasMany(models.labAnswer,{foreignKey:'lab_body_Id'});
}
     return LabBody;
}
