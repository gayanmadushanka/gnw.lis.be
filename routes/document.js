const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const readdir = require("fs-readdir-promise");

const router = express.Router();

router.get("/templates", async (req, res) => {
  readdir(path.resolve("./templates"))
    .then((files) => {
      res.json(files);
    })
    .catch(function (err) {
      res.json(err.message);
    });
});

router.get("/generate", function (req, res) {
  try {
    const data = {
      first_name: "ගයාන්",
      last_name: "මධූශංඛ",
      phone_no: "0714254030",
      date: new Date(),
    };

    const pizZip = new PizZip(
      fs.readFileSync(path.resolve("./templates/template-1.docx"))
    );

    const doc = new Docxtemplater(pizZip);
    doc.setData(data);
    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    const outputPath = path.resolve("./output/output-1.docx");
    fs.writeFileSync(outputPath, buffer);
    res.json("success");
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/download", function (req, res) {
  try {
    const data = {
      first_name: "ගයාන්",
      last_name: "මධූශංඛ",
      phone_no: "0714254030",
      date: new Date(),
    };

    const pizZip = new PizZip(
      fs.readFileSync(path.resolve("./templates/template-1.docx"))
    );

    const doc = new Docxtemplater(pizZip);
    doc.setData(data);
    doc.render();

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    const outputPath = path.resolve("./output/output-1.docx");
    fs.writeFileSync(outputPath, buffer);
    res.set("Access-Control-Expose-Headers", "Content-Disposition");
    res.download(outputPath, "output.docx");
  } catch (err) {
    console.log(err.message);
  }
});

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
