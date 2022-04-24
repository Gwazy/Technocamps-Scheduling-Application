"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Entries, User }) {
      // this.belongsTo(Entries, { foreignKey: "entriesId" });
      this.belongsTo(User, { foreignKey: "userId" });
      this.belongsTo(Entries, { foreignKey: "entriesId", unique: true });
    }
  }
  Schedule.init(
    {
      placeholder: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelTable: "schedule",
      modelName: "Schedule",
    }
  );
  return Schedule;
};
