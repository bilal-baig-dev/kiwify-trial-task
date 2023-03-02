const defaultResponse = require("../utils/defaultResponse");
const QuizModel = require("../models/quiz.js");
const QuestionModel = require("../models/questions.js");
const AnswersModel = require("../models/answers.js");
const sequelizeConnection = require("../config/db-connection");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//CRUD functions for quiz, question & Answers
async function createQuestion(question) {
  try {
    const res = await QuestionModel.create(question);
    return res;
  } catch (err) {
    return err;
  }
}

async function deleteQuestion(id) {
  try {
    const res = await QuestionModel.destroy({ where: { id: id } });
    return res;
  } catch (err) {
    return err;
  }
}

async function createBulkAnswers(answersList) {
  try {
    const res = await AnswersModel.bulkCreate(answersList);
    return res;
  } catch (err) {
    return err;
  }
}

async function bulkDeleteAnswers(answersIDs) {
  try {
    const res = await AnswersModel.destroy({ where: { id: answersIDs } });
    return res;
  } catch (err) {
    return err;
  }
}

async function updateCorrectAnswrId(answerId, questionId) {
  try {
    const res = await QuestionModel.update(
      { correct_answer_id: answerId },
      {
        where: { id: questionId },
      }
    );
    return res;
  } catch (err) {
    return err;
  }
}

async function findCorrectAnswer(question_id) {
  try {
    const res = await AnswersModel.findOne({
      where: {
        question_id,
        isCorrect: true,
      },
    });
    return res;
  } catch (err) {
    return err;
  }
}

async function getQuizById(quiz_id) {
  try {
    const res = await QuizModel.findOne({
      where: {
        id: quiz_id,
      },
      include: [
        {
          association: "questions",
          include: {
            association: "answers",
          },
        },
      ],
    });
    return res;
  } catch (err) {
    return err;
  }
}

async function findAllQuestionByQuizID(quiz_id) {
  try {
    const res = await QuestionModel.findAll({
      where: {
        quiz_id,
      },
      include: [{ association: "answers" }],
    });
    return res;
  } catch (err) {
    return err;
  }
}

async function destroyingQuestionsAndAnswers(questions) {
  try {
    await questions
      .filter((item) => item.id)
      .sort((a, b) => Number(a.order) - Number(b.order))
      .reduce(async (promise, question) => {
        await promise;
        const answers = question.answers;

        const answersIDs = [];
        answers
          .filter((item) => item.id)
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((answer) => {
            const { id } = answer;
            answersIDs.push(id);
            return {
              id,
            };
          });
        const deletedAnswers = await bulkDeleteAnswers(answersIDs);

        const { id } = question;

        const deletedquestion = await deleteQuestion(id);
      }, Promise.resolve());

    return "Successfully deleted records";
  } catch (err) {
    return err;
  }
}

async function insertRecords(questions, quiz_id) {
  try {
    let questionsList = [];
    await questions
      .sort((a, b) => Number(a.order) - Number(b.order))
      .reduce(async (promise, question) => {
        await promise;
        const { title, isMandatory, order } = question;
        const answers = question.answers;
        const questionBody = {
          title,
          isMandatory: isMandatory ? true : false,
          order,
          quiz_id,
        };

        const questionCreated = await createQuestion({
          ...questionBody,
        });

        const question_id = questionCreated.dataValues.id;

        const answersList = answers
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((answer) => {
            const { text, isCorrect, order } = answer;

            return {
              text,
              isCorrect: isCorrect ? true : false,
              order,
              question_id,
            };
          });

        const answersBulkCreated = await createBulkAnswers(answersList);
        const correctAnswers = await findCorrectAnswer(question_id);

        const correctanswerID = correctAnswers.dataValues.id;

        const updateCoorectAnswerID = await updateCorrectAnswrId(
          correctanswerID,
          question_id
        );
        questionsList.push({
          ...questionCreated.dataValues,
          correct_answer_id: correctanswerID,
          answers: [...answersBulkCreated],
        });
      }, Promise.resolve());
    return questionsList;
  } catch (err) {
    return err;
  }
}

exports.create = catchAsync(async (req, res, next) => {
  const transaction = await sequelizeConnection.transaction();

  try {
    let body = { ...req.body };
    let questions = body.questions;
    delete body.questions;
    let quizBody = {
      ...body,
      isPublished: body.isPublished ? true : false,
    };
    const quizCreated = await QuizModel.create(quizBody);
    const quiz_id = quizCreated.dataValues.id;

    const questionLength = questions !== undefined ? questions.length : null;
    if (questionLength) {
      //insert records
      const questionsList = await insertRecords(questions, quiz_id);

      const resData = {
        ...quizCreated.dataValues,
        questions: questionsList,
      };
      await transaction.commit();

      return defaultResponse().success(
        { message: "Quiz Created Successfully" },
        resData,
        res,
        201
      );
    } else {
      const resData = {
        ...quizCreated.dataValues,
        questions: [],
      };
      await transaction.commit();

      return defaultResponse().success(
        { message: "Quiz Created Successfully" },
        resData,
        res,
        201
      );
    }
  } catch (e) {
    await transaction.rollback();
    return next(new AppError(e.message, 500));
  }
});

exports.update = catchAsync(async (req, res, next) => {
  const transaction = await sequelizeConnection.transaction();
  try {
    let body = { ...req.body };
    let questions = body.questions;
    delete body.questions;
    let quizBody = {
      ...body,
      isPublished: body.isPublished ? true : false,
    };
    const quizParamID = req.params.id;

    const quizUpdated = await QuizModel.update(quizBody, {
      where: { id: quizParamID },
    });
    const allquestion = await findAllQuestionByQuizID(quizParamID);
    const records = allquestion.map((result) => result.dataValues);

    const questionLength = questions !== undefined ? questions.length : null;

    if (questionLength) {
      //destroying all data
      await destroyingQuestionsAndAnswers(records);

      //insert records
      const questionsList = await insertRecords(questions, quizParamID);

      const resData = {
        questions: questionsList,
      };
      await transaction.commit();

      return defaultResponse().success(
        { message: "Quiz Updated Successfully" },
        resData,
        res,
        200
      );
    } else {
      //destroying all data
      await destroyingQuestionsAndAnswers(records);
      const resData = {
        questions: [],
      };
      await transaction.commit();

      return defaultResponse().success(
        { message: "Quiz Updated Successfully" },
        resData,
        res,
        200
      );
    }
  } catch (e) {
    await transaction.rollback();
    return next(new AppError(e.message, 500));
  }
});

exports.get = catchAsync(async (req, res, next) => {
  try {
    const quizParamID = req.params.id;
    const data = await getQuizById(quizParamID);

    return defaultResponse().success(
      { message: "Quiz Fetched Successfully" },
      data,
      res,
      200
    );
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
});
