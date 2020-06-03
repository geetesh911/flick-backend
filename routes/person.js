const express = require("express");
const JustWatch = require("./index");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const justwatch = new JustWatch({ locale: "en_IN" });

    const personID = req.query.person_id;

    const tmdbPerson = await fetch(
      `https://api.themoviedb.org/3/person/${personID}?api_key=c21a2d47027f8fc50ec163849848819b&language=en-US`
    );
    const tmdbPersonData = await tmdbPerson.json();

    if (tmdbPersonData.profile_path)
      tmdbPersonData.profile_path = `https://image.tmdb.org/t/p/w138_and_h175_face${tmdbPersonData.profile_path}`;
    res.send(tmdbPersonData);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
