const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch;
};

function errorHandler(err, req, res, next) {
  console.error("Error Trace:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Errorf";

  res.status(statusCode).json({ message });
}
module.exports = {
  asyncHandler,
  errorHandler,
};
