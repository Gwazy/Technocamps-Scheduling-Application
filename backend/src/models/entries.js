"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Schedule }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
      this.hasOne(Schedule, { foreignKey: "entriesId", unique: true });
    }
  }
  Entries.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      bookingTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      online: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      calendarId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      confirmation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "entries",
      modelName: "Entries",
    }
  );
  return Entries;
};
