const express = require("express");
const app = express();
const { auth_router, auth_handler } = require("./routes/auth");
const { article_router } = require("./routes/article");
const { image_router } = require("./routes/image");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
    app.use(cors());
}

// Set up body parsing middleware
app.use(express.json());
app.use(auth_handler);
app.use("/auth", auth_router);
app.use("/articles", article_router);
app.use("/images", image_router);

module.exports = { app };
