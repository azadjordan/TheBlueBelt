const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV == "production" ? "PanCake" : err.stack, // send the stack trace if we are in development but it's just pancake if we are in production
  })
}

export { notFound, errorHandler }
