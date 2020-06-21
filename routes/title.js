const express = require("express");
const JustWatch = require("./index");
const fetch = require("node-fetch");
const axios = require("axios");
const stringify = require("json-stringify-safe");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const justwatch = new JustWatch({ locale: "en_IN" });

    const contentType = req.query.ctype;
    const titleID = req.query.title_id;
    const searchResult = await justwatch.getTitle(
      contentType,
      parseInt(titleID)
    );

    // console.log(searchResult);

    // correct poster urls
    if (searchResult.poster) {
      searchResult.poster = `https://images.justwatch.com${searchResult.poster}`;
      splittedPosterURL = searchResult.poster.split("/");
      splittedPosterURL[splittedPosterURL.length - 1] = "s592";
      searchResult.poster = splittedPosterURL.join("/");
    }

    // correct backdrops urls
    if (searchResult.backdrops) {
      searchResult.backdrops.forEach((img) => {
        img.backdrop_url = `https://images.justwatch.com${img.backdrop_url}`;
        splittedBackdropURL = img.backdrop_url.split("/");
        splittedBackdropURL[splittedBackdropURL.length - 1] = "s1440";
        return (img.backdrop_url = splittedBackdropURL.join("/"));
      });
    }

    // correct seasons poster urls
    if (searchResult.seasons) {
      searchResult.seasons.forEach((img) => {
        img.poster = `https://images.justwatch.com${img.poster}`;
        splittedBackdropURL = img.poster.split("/");
        splittedBackdropURL[splittedBackdropURL.length - 1] = "s166";
        return (img.poster = splittedBackdropURL.join("/"));
      });
    }

    // correct clip url
    if (searchResult.clips) {
      searchResult.clips.forEach(
        (url) =>
          (url.external_id = `https://www.youtube.com/embed/${url.external_id}?controls=1`)
      );
    }

    let type = searchResult.object_type === "show" ? "tv" : "movie";

    let tmdbID = null;

    searchResult.external_ids.forEach((id) => {
      if (id.provider === "tmdb") tmdbID = id.external_id;
    });

    try {
      const tmdbSearch = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=c21a2d47027f8fc50ec163849848819b&language=en-US&query=${searchResult.title}&page=1&include_adult=false`
      );
      // console.log("object");

      const tmdbData = await tmdbSearch.json();
      // let tmdbID = null;
      searchResult.external_ids.forEach((id) => {
        if (id.provider === "tmdb") {
          tmdbID = id.external_id;
        }
      });

      for (let i = 0; i < tmdbData.results.length; i++) {
        let releaseYear = "";
        if (tmdbData.results[i].release_date)
          releaseYear = tmdbData.results[i].release_date.split("-")[0];
        if (
          searchResult.original_title === tmdbData.results[i].original_title &&
          searchResult.original_release_year === parseInt(releaseYear)
        ) {
          tmdbID = tmdbData.results[i].id;
          break;
        }
      }

      const tmdbCast = await fetch(
        `https://api.themoviedb.org/3/${type}/${tmdbID}/credits?api_key=c21a2d47027f8fc50ec163849848819b&language=en-US`
      );

      const cast = await tmdbCast.json();

      cast.cast.forEach((person) => {
        if (person.profile_path)
          person.profile_path = `https://image.tmdb.org/t/p/w138_and_h175_face${person.profile_path}`;
      });

      searchResult.cast = cast;

      const response = await fetch(
        `https://apis.justwatch.com/content/titles/en_IN/recommendations?jw_entity_ids=${searchResult.jw_entity_id}&body=%7B%22page_size%22:12,%22page%22:1%7D&similar_model_type=CONTENT`
      );
      const data = await response.json();

      data.items.forEach((d) => {
        if (d.poster) {
          d.poster = `https://images.justwatch.com${d.poster}`;
          let splittedPosterURL = d.poster.split("/");
          splittedPosterURL[splittedPosterURL.length - 1] = "s592";
          d.poster = splittedPosterURL.join("/");
        }
      });

      searchResult.recommendation = data;
    } catch (error) {
      // console.log("object");
      console.log(error.message);
    }

    let video = null;

    const ip = req.query.ipAdd;

    if (type === "movie") {
      video = await axios.get(
        `https://vsrequest.video/request.php?key=X3a8auPsuzVwAMXA&secret_key=ehylz9b4kan88qotd3r97zaqo6tcaz&video_id=${tmdbID}&tmdb=1&ip=${ip}`
      );
      video = stringify(video.data);
    } else {
      video = await axios.get(
        `https://vsrequest.video/request.php?key=X3a8auPsuzVwAMXA&secret_key=ehylz9b4kan88qotd3r97zaqo6tcaz&video_id=${tmdbID}&tmdb=1&tv=1&s=1&ip=${ip}`
      );
      video = stringify(video.data);
    }

    searchResult.videoSource = video.split('"')[1];

    searchResult.tmdbID = tmdbID;

    res.send(searchResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
