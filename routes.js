const router = require("express").Router();

const quizRoutes = require("./routes/quiz.route");

//CRUD Routes For Quiz
router.use("/quiz", quizRoutes);

module.exports = router;
