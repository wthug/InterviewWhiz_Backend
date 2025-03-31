require("dotenv").config()
const express = require("express")
const mongoose = require('mongoose');
const app = express()
const bodyParser = require("body-parser")
const userRoutes = require("./routes/user")
const verifyRoutes = require("./routes/verify")
const {connect} = require("./db/connect")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())

// mongodb connection
connect();

app.use((req, res, next) => {
    console.log(req.path + " " + req.method);
    next()
})

app.use("/api/user", userRoutes)
app.use("/api/verify", verifyRoutes)

app.get("/", (req, res) => {
    res.send("hello from github actions")
})

