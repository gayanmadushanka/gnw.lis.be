const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const readdir = require("fs-readdir-promise");

const { sleep, createDir } = require("./helpers");

const router = express.Router();

router.get("/templates", async (_, res) => {
  try {
    await sleep(2000);

    const templatePath = resolve("./templates");
    const data = [];
    for (const subDirectoriesAndFiles of await readdir(templatePath)) {
      const fullPath = templatePath + "/" + subDirectoriesAndFiles;
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        for (const file of await readdir(fullPath)) {
          data.push({
            section: subDirectoriesAndFiles,
            templateId: file.split(".")[0],
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

router.get("/template/:section/:templateId/metadata", async (req, res) => {
  try {
    const { section, templateId } = req.params;
    const metadata = fs.readFileSync(
      resolve("./templates/" + section + "/" + templateId + ".json")
    );
    res.json(JSON.parse(metadata));
  } catch (err) {
    console.log(err.message);
  }
});

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
