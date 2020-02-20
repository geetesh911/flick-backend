const express = require("express");
const JustWatch = require("./index");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const justwatch = new JustWatch();

    const searchResult = await justwatch.getGenres();

    res.send(searchResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
