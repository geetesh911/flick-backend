const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const WatchList = require("../models/WatchList");

const router = express.Router();

// @routes  GET api/watchLists
// @desc    Get all user watchLists
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const watchLists = await WatchList.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(watchLists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @routes  POST api/watchLists
// // @desc    Add a watchList
// // @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }

    const {
      id,
      title,
      poster,
      scoring,
      offers,
      original_release_year,
      object_type
    } = req.body;

    try {
      const newWatchList = new WatchList({
        id,
        title,
        poster,
        scoring,
        offers,
        original_release_year,
        object_type,
        user: req.user.id
      });

      const watchList = await newWatchList.save();

      res.json(watchList);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// // @routes  PUT api/watchLists/:id
// // @desc    Update a watchList
// // @access  Public
// router.put("/:id", auth, async (req, res) => {
//   const {
//     id,
//     title,
//     poster,
//     short_description,
//     original_release_year,
//     object_type,
//     offers
//   } = req.body;

//   // Build a watchList object
//   const watchListFields = {};

//   if (id) watchListFields.id = id;
//   if (title) watchListFields.title = title;
//   if (poster) watchListFields.poster = poster;
//   if (review) watchListFields.review = review;
//   if (date) watchListFields.date = new Date(date).toISOString();
//   if (zomato) watchListFields.zomato = zomato;
//   if (beenThere) watchListFields.beenThere = beenThere;
//   // if (date) watchListFields.date = date;

//   try {
//     let watchList = await WatchList.findById(req.params.id);

//     if (!watchList) return res.status(500).json({ msg: "WatchList not found" });

//     // Make sure user owns watchList

//     if (watchList.user.toString() !== req.user.id) {
//       return res.status(401).json({ msg: "Not Authorized" });
//     }

//     watchList = await WatchList.findOneAndUpdate(
//       { _id: req.params.id },
//       { $set: watchListFields },
//       { new: true }
//     );

//     // watchList = await WatchList.findByIdAndUpdate(
//     //   req.params.id,
//     //   { $set: watchListFields },
//     //   { new: true }
//     // );

//     res.json(watchList);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @routes  DELETE api/watchLists/:id
// @desc    delete a watchList
// @access  Public
router.delete("/:id", auth, async (req, res) => {
  try {
    let watchList = await WatchList.findById(req.params.id);

    if (!watchList) return res.status(500).json({ msg: "WatchList not found" });

    // Make sure user owns the watchList
    if (watchList.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }

    await WatchList.findByIdAndRemove(req.params.id);

    res.json({ msg: "WatchList Removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
