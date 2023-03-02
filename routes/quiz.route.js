var router = require("express").Router();
const quizController = require("../controllers/quiz.controller");
const schemaValiator = require("../middlewares/schemaValiator");
const quizValidation = require("../validations/quiz-validation");

// QUIZ CRUD Route
router.post(
  "/",
  schemaValiator(quizValidation.createUpdateQuiz),
  quizController.create
);
router.put(
  "/:id",
  schemaValiator(quizValidation.createUpdateQuiz),
  quizController.update
);

router.get("/:id", quizController.get);

module.exports = router;
