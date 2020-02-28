const express = require("express");
const JustWatch = require("./index");
const fetch = require("node-fetch");
const axios = require("axios");
const stringify = require("json-stringify-safe");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const justwatch = new JustWatch();

    const seasonID = req.query.season_id;
    const searchResult = await justwatch.getSeason(seasonID);

    // correct poster urls
    if (searchResult.poster) {
      searchResult.poster = `https://images.justwatch.com${searchResult.poster}`;
      splittedPosterURL = searchResult.poster.split("/");
      splittedPosterURL[splittedPosterURL.length - 1] = "s592";
      searchResult.poster = splittedPosterURL.join("/");
    }

    // correct backdrops urls
    if (searchResult.backdrops) {
      searchResult.backdrops.forEach(img => {
        img.backdrop_url = `https://images.justwatch.com${img.backdrop_url}`;
        splittedBackdropURL = img.backdrop_url.split("/");
        splittedBackdropURL[splittedBackdropURL.length - 1] = "s1440";
        return (img.backdrop_url = splittedBackdropURL.join("/"));
      });
    }

    let tmdbID = null;
    let seasonNo = null;

    searchResult.external_ids.forEach(id => {
      if (id.provider === "tmdb") {
        tmdbID = id.external_id.split(":")[0];
        seasonNo = id.external_id.split(":")[1];
      }
    });

    const tmdbCast = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbID}/season/${seasonNo}/credits?api_key=c21a2d47027f8fc50ec163849848819b&language=en-US`
    );

    const cast = await tmdbCast.json();

    cast.cast.forEach(person => {
      if (person.profile_path)
        person.profile_path = `https://image.tmdb.org/t/p/w138_and_h175_face${person.profile_path}`;
    });

    searchResult.cast = cast;

    // let episodes = [];
    const ip = req.query.ipAdd;

    video = await axios.get(
      `https://vsrequest.video/request.php?key=X3a8auPsuzVwAMXA&secret_key=ehylz9b4kan88qotd3r97zaqo6tcaz&video_id=${tmdbID}&tmdb=1&tv=1&s=${searchResult.season_number}&ip=${ip}`
    );
    video = stringify(video.data);
    video = video.split('"')[1];
    searchResult.videoSource = video;

    searchResult.tmdbID = tmdbID;

    res.send(searchResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
