const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use((req, res, next) => {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization,x-auth-token"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );

  // Pass to next layer of middleware
  next();
});

// Routes
app.get("/", (req, res) => res.json({ msg: "Welcome to flick" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/search", require("./routes/search"));
app.use("/api/title", require("./routes/title"));
app.use("/api/episode", require("./routes/episodes"));
app.use("/api/season", require("./routes/seasons"));
app.use("/api/person", require("./routes/person"));
app.use("/api/genres", require("./routes/genres"));
app.use("/api/providers", require("./routes/providers"));
app.use("/api/watchlist", require("./routes/watchlist"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
