"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class calender_entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  calender_entries.init(
    {
      bookingdate: DataTypes.STRING,
      capacity: DataTypes.STRING,
      online: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: "calender_entries",
      modelName: "calender_entries",
    }
  );
  return calender_entries;
};
