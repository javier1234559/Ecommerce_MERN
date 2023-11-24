const notFound = (req, res, next) => {  // this is a final middle of app if not found any router this function will return
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
  
const errorHandler = (err, req, res, next) => { //error handler of app with "err" argument
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
  
  export { notFound, errorHandler };
  