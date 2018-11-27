const express = require("express");
const app = express();
const session = require("express-session");
const axios = require("axios");
const port = 3000;
const ia = "https://ia.junthehacker.com";
const appId = "5bfcad8cccf33f6bb928ae48";

app.use(
  session({
    resave: false,
    secret: "secret",
    saveUninitialized: true
  })
);

// Authentication middleware
app.use((req, res, next) => {
  axios
    .get(`${ia}/api/user`, {
      headers: {
        authorization: `Bearer ${req.session.token}`
      }
    })
    .then(data => {
      req.user = data.data;
      next();
    })
    .catch(e => {
      console.log(e.response);
      next(e);
    });
});

app.get("/", (req, res) => {
  res.json({ hellow: true });
});

// Assertion endpoint
app.get("/ia/login", (req, res) => {
  req.session.token = req.query.token;
  res.redirect("/account");
});

// Protected resource
app.get("/account", (req, res) => {
  if (!req.user) {
    res.redirect(`${ia}/login?id=${appId}`);
  } else {
    res.send(`<h1>Hi! ${user._id}</h1>`);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
