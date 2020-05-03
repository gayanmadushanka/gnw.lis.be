const fs = require("fs");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

exports.sleep = sleep;
exports.createDir = createDir;

// function errorHandler(error) {
//   console.log(JSON.stringify({ error: error }, replaceErrors));
//   if (error.properties && error.properties.errors instanceof Array) {
//     const errorMessages = error.properties.errors
//       .map(function (error) {
//         return error.properties.explanation;
//       })
//       .join("\n");
//     console.log("errorMessages", errorMessages);
//   }
//   throw error;
// }

// function replaceErrors(key, value) {
//   if (value instanceof Error) {
//     return Object.getOwnPropertyNames(value).reduce(function (error, key) {
//       error[key] = value[key];
//       return error;
//     }, {});
//   }
//   return value;
// }
