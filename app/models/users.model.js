module.exports = (sequelize, Sequelize) => {
const Users = sequelize.define ( "user", {
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
    name: { 
        type: Sequelize.STRING
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
  });
     return Users;
}
