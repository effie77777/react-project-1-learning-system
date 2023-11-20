require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
require("./config/passport");
const cors = require("cors");
const authRoute = require("./routes").authRoute; //不用再寫/index
const courseRoute = require("./routes").courseRoute;

//db
mongoose.connect(process.env.DB_CONNECT)
.then(() => {
    console.log("connect to db successfully!");
})
.catch((e) => {
    console.log(e);
})

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);
app.use("/api/course", passport.authenticate("jwt", { session: false }), courseRoute);

app.listen(8000, () => {
    console.log("server listening on port 8000.");
})