const yup = require("yup");

module.exports = {
  createUpdateQuiz: yup.object({
    title: yup.string().required(),
  }),
};
