require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const interviewRoutes = require("./routes/interviewRoutes");
const userRoutes = require("./routes/userRoute");
const verifyRoutes = require("./routes/verify");
const resourceRoutes = require("./routes/resourceRoutes")
const forgetPassRoute = require('./routes/forgetPassRoute')
const portalRoute = require('./routes/portal')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connect } = require("./db/connect");

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(express.json());
app.use(cookieParser());
app.use( 
    
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// mongodb connection
connect();

app.use((req, res, next) => {
  console.log(req.path + " " + req.method);
  next();
});

app.use("/api/reset", forgetPassRoute);
app.use("/api/user", userRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/portal", portalRoute);

app.get("/", (req, res) => {
  res.send("hello from github actions");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
