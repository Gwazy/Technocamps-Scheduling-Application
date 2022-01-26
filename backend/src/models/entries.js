"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "userId" });
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
      confirmation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
