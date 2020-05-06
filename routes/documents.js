const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const { sleep, createDir } = require("./helpers");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    await sleep(2000);

    const templateName = req.body.templateId + ".docx";
    const pizZip = new PizZip(
      fs.readFileSync(
        resolve("./templates/" + req.body.section + "/" + templateName)
      )
    );

    const doc = new Docxtemplater(pizZip);
    doc.setData(req.body.data);
    doc.render();

    const outputDirectoriyPath = resolve("./output/" + req.body.section);
    createDir(outputDirectoriyPath);
    const outputFilePath = outputDirectoriyPath + "/" + templateName;

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputFilePath, buffer);
    res.set("Access-Control-Expose-Headers", "Content-Disposition");
    res.download(outputFilePath, templateName);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
