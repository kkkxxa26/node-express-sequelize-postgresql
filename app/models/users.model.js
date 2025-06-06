const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: { type: Sequelize.STRING },
    surname: { type: Sequelize.STRING },
    phoneNumber: { type: Sequelize.STRING },
    birthDate: { type: Sequelize.DATE },
    gender: {
      type: Sequelize.STRING,
      values: ['male', 'female', 'other']
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user'
    }
  }, {
    hooks: {
      // хеш пароль перед созданием user
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  Users.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Users;
};
