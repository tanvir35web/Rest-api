const fs = require('fs');

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

const date = new Date();
const formattedDateTime = formatDateTime(date);
console.log(formattedDateTime);

// Middleware for logging HTTP requests
function logResReq(fileName) {
  return (req, res, next) => {
    fs.appendFile(fileName, `[${formattedDateTime}] ${req.method} ${req.url} - ${res.statusCode}\n`, err => {
      if (err) {
        console.error('Error writing log:', err);
      }
    });
    next();
  }
}
module.exports = { logResReq };