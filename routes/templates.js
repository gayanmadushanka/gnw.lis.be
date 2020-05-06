const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const readdir = require("fs-readdir-promise");

const { sleep } = require("./helpers");

const router = express.Router();

router.get("/", async (_, res) => {
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

router.get("/:section/:templateId/metadata", async (req, res) => {
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

module.exports = router;
