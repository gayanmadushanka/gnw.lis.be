const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const readdir = require("fs-readdir-promise");

const router = express.Router();

router.get("/templates", async (_, res) => {
  try {
    const templatePath = resolve("./templates");
    const data = [];
    for (const subDirectoriesAndFiles of await readdir(templatePath)) {
      const fullPath = templatePath + "/" + subDirectoriesAndFiles;
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        for (const file of await readdir(fullPath)) {
          data.push({
            section: subDirectoriesAndFiles,
            templateName: file,
          });
        }
      }
    }
    res.json(data);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/generate", function (req, res) {
  try {
    const pizZip = new PizZip(
      fs.readFileSync(
        resolve("./templates/" + req.body.section + "/" + req.body.templateName)
      )
    );

    const doc = new Docxtemplater(pizZip);
    doc.setData(req.body.data);
    doc.render();

    const outputDirectoriyPath = resolve("./output/" + req.body.section);
    createDir(outputDirectoriyPath);
    const outputFilePath = outputDirectoriyPath + "/" + req.body.templateName;

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputFilePath, buffer);
    res.set("Access-Control-Expose-Headers", "Content-Disposition");
    res.download(outputFilePath, req.body.templateName);
  } catch (err) {
    console.log(err.message);
  }
});

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// router.get("/templates", async (req, res) => {
//   readdir(path.resolve("./templates"))
//     .then((files) => {
//       res.json(files);
//     })
//     .catch(function (err) {
//       res.json(err.message);
//     });
// });

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

module.exports = router;
