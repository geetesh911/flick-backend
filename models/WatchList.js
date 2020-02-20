const mongoose = require("mongoose");

const WatchListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  id: {
    type: Number
  },
  title: {
    type: String
  },
  scoring: [
    {
      provider_type: {
        type: String
      },
      value: {
        type: String
      }
    }
  ],
  poster: {
    type: String
  },
  original_release_year: {
    type: Number
  },
  object_type: {
    type: String
  },
  offers: {
    type: Array
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("watchList", WatchListSchema);
