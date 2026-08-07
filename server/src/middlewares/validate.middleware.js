import serverError from "../utils/server-error.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: result.error.errors,
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      return serverError(error, res);
    }
  };
};

export default validate;
