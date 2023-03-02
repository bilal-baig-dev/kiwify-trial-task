module.exports = () => {
  let resultErrorObject = {
    error: false,
    message: "",
  };

  let resultSuccessObject = {};

  return {
    //Default response called from every controller in case of a error.
    error: (error, res, status = 500) => {
      console.log("error: ", error);
      resultErrorObject.error = true;
      resultSuccessObject.success = false;

      resultErrorObject.message = error.message;
      resultErrorObject.data = null;

      res.status(status).json(resultErrorObject);
    },
    //Default response called from every controller in case of a success.
    success: (message, response, res, status) => {
      resultSuccessObject.error = false;
      resultSuccessObject.success = true;

      resultSuccessObject.message = message;
      if (response == null) {
        status = 201;
      }
      resultSuccessObject.data = response;
      res.status(status).json(resultSuccessObject);
    },
  };
};
