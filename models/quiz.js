const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelizeConnection = require("../config/db-connection");

class QUIZ extends Model {}

QUIZ.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.TEXT,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    isPublished: {
      type: Sequelize.TINYINT,
      defaultValue: false,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "QUIZ",
    tableName: "QUIZ",
    freezeTableName: true,
    timestamps: true,
  }
);

// OBJECT.hasMany(ADD_ON_SERVICE, {
//   as: "addOnServices",
//   foreignKey: "object_id",
// });

module.exports = QUIZ;
