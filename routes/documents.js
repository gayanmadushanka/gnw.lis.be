var express = require("express");
var fs = require("fs");
var path = require("path");
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");

var router = express.Router();

router.get("/", function (req, res, next) {
  try {
    const data = {
      first_name: "ගයාන්",
      last_name: "මධූශංඛ",
      phone_no: "0714254012",
      date: new Date(),
    };

    fs.writeFileSync(path.resolve("./data/data-1.json"), JSON.stringify(data));

    const pizZip = new PizZip(
      fs.readFileSync(path.resolve("./templates/template-1.docx"))
    );
    const doc = new Docxtemplater(pizZip);
    doc.setData(data);
    doc.render();
    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    const outputPath = path.resolve("./output/output-1.docx");
    fs.writeFileSync(outputPath, buffer);
    res.download(outputPath, "output.docx");
  } catch (error) {
    errorHandler(error);
  }
});

function errorHandler(error) {
  console.log(JSON.stringify({ error: error }, replaceErrors));
  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors
      .map(function (error) {
        return error.properties.explanation;
      })
      .join("\n");
    console.log("errorMessages", errorMessages);
  }
  throw error;
}

function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

module.exports = router;
