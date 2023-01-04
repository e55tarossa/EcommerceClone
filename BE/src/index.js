const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'})); // cho phep file nang
app.use(bodyParser.json())
app.use(cookieParser())
routes(app)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
});


app.listen(process.env.PORT || 3001 , () => {
    console.log("Server is running ! ");
})
