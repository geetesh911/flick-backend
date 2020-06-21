const express = require("express");
const JustWatch = require("./index");
const fetch = require("node-fetch");
const encode = require("../utils/partialURLEncode");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = req.query.query;
    let genres = req.query.genres;
    let content_types = req.query.type;
    let providers = req.query.providers;
    let year = req.query.year;

    year = JSON.parse(year);

    genres = encode(genres);

    providers = encode(providers);

    content_types = encode(content_types);

    const reqURL = `https://apis.justwatch.com/content/titles/en_IN/popular?body=%7B%22age_certifications%22:[],%22content_types%22:${
      content_types || "[]"
    },%22genres%22:${
      genres || "[]"
    },%22languages%22:null,%22min_price%22:null,%22max_price%22:null,%22monetization_types%22:[],%22presentation_types%22:[],%22providers%22:${
      providers || "[]"
    },%22release_year_from%22:${year[0] || "null"},%22release_year_until%22:${
      year[1] || "null"
    },%22scoring_filter_types%22:null,%22timeline_type%22:null,%22sort_by%22:null,%22sort_asc%22:null,%22query%22:%22${query}%22,%22page%22:1,%22page_size%22:100%7D`;

    const response = await fetch(reqURL);

    const data = await response.json();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
