module.exports = async () => {
  const questionModel = require("./models/questions");
  const answersModel = require("./models/answers");
  const quizModel = require("./models/quiz");

  quizModel.hasMany(questionModel, {
    as: "questions",
    foreignKey: "quiz_id",
  });

  questionModel.hasMany(answersModel, {
    as: "answers",
    foreignKey: "question_id",
  });
};
