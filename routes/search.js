const express = require("express");
const JustWatch = require("./index");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const justwatch = new JustWatch({ locale: "en_IN" });

    const query = req.query.q;
    const searchResult = await justwatch.search({ query: query });

    res.send(searchResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
