const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandlingMiddleware = require("./Middlewares/errorHandler");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const Xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path")

const app = express();
const itemRoute = require("./Routes/itemRoute");
const userRoute = require("./Routes/userRoute");
const cartRoute = require("./Routes/cartRoute");
const orderRoute = require("./Routes/orderRoute");
const wishlistRoute = require("./Routes/wishlistRoute");
const addressRoute = require("./Routes/addressRoute");

const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000, //time to reset
  message: "Too many requests from this IP, please try again in an hour!",
});

//rendering frontend
app.use(express.static(path.join(__dirname, "public/build")));

app.use(helmet());
app.use(mongoSanitize());
app.use(Xss());
app.use(hpp());
app.use(express.json());

// app.set("trust proxy", 1);
app.use(
  cors({
     origin: "http://localhost:3000",
    //origin: "https://davak-ecomerce.netlify.app",
    credentials: true,
    // allowedHeaders:[
    //   'Access-Control-Allow-Origin',
    //   'Content-Type',
    //   'Authorization'
    // ]
  })
);
app.use(cookieParser());

app.use("/api/v1/items", itemRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/address", addressRoute);
// app.use("/api", limiter);

app.get("/", (req, res) => {
  res.end("hello from node");
});

// Catch-all route to handle all other requests (serve your frontend application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/build", "index.html"));
});

app.use(errorHandlingMiddleware);
module.exports = app;
