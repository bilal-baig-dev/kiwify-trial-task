const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelizeConnection = require("../config/db-connection");
const question = require("./questions");

class ANSWERS extends Model {}

ANSWERS.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: Sequelize.TEXT,
    },
    isCorrect: {
      type: Sequelize.TINYINT,
      defaultValue: false,
    },
    order: {
      type: Sequelize.INTEGER,
    },
    question_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: question,
        key: "id",
      },
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
    modelName: "ANSWERS",
    tableName: "ANSWERS",
    freezeTableName: true,
    timestamps: true,
  }
);

// OBJECT.hasMany(ADD_ON_SERVICE, {
//   as: "addOnServices",
//   foreignKey: "object_id",
// });

module.exports = ANSWERS;
