module.exports = (sequelize, Sequelize) => {
const LabHead = sequelize.define ( "lab_head", {
    title: {
        type: Sequelize.STRING
    }
});

LabHead.associate = function(models){
    LabHead.hasMany(models.labBody,{foreignKey:'lab_head_Id'});
}
     return LabHead;
}
