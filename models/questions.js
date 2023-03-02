const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelizeConnection = require("../config/db-connection");
const quiz = require("./quiz");

class QUESTION extends Model {}

QUESTION.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.TEXT,
    },
    isMandatory: {
      type: Sequelize.TINYINT,
      defaultValue: false,
    },
    order: {
      type: Sequelize.INTEGER,
    },
    quiz_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: quiz,
        key: "id",
      },
    },
    correct_answer_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
    modelName: "QUESTION",
    tableName: "QUESTION",
    freezeTableName: true,
    timestamps: true,
  }
);

// OBJECT.hasMany(ADD_ON_SERVICE, {
//   as: "addOnServices",
//   foreignKey: "object_id",
// });

module.exports = QUESTION;
