"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Entries }) {
      // this.hasMany(Entries, { foreignKey: "userId", as: "entries" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      emailaddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelTable: "user",
      modelName: "User",
    }
  );
  return User;
};
