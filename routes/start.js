const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const url = `https://apis.justwatch.com/content/titles/en_IN/popular?body=%7B%22content_types%22:[],%22monetization_types%22:[],%22page%22:0,%22page_size%22:100%7D`;
    const response = await fetch(url);
    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
