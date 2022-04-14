"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Entries }) {
      // this.hasMany(Entries, { foreignKey: "courseId", as: "entries" });
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      capacity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "course",
      modelName: "Course",
    }
  );
  return Course;
};
