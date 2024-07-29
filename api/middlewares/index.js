const fs = require('fs');

// Middleware for logging HTTP requests
function logResReq(fileName) {
  return (req, res, next) => {
    fs.appendFile(fileName, `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode}\n`, err => {
      if (err) {
        console.error('Error writing log:', err);
      }
    });
    next();
  }
}
module.exports = { logResReq };