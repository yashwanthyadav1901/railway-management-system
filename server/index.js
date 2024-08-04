require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./database/db");

const app = express();
let port = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/train", require("./routes/trainRoutes"));
app.use("/booking", require("./routes/bookingRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("text").send("404 not found");
  }
});

const handleListenError = (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Trying another port...`);
    app
      .listen(++port, () => {
        console.log(`Server running on port ${port}`);
      })
      .on("error", handleListenError);
  } else {
    console.error(error);
    process.exit(1);
  }
};

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", handleListenError);
