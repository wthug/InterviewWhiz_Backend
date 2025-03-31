require("dotenv").config()
const express = require("express")
const mongoose = require('mongoose');
const app = express()
const bodyParser = require("body-parser")
const userRoutes = require("./routes/user")
const verifyRoutes = require("./routes/verify")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path + " " + req.method);
    next()
})

app.use("/api/user", userRoutes)
app.use("/api/verify", verifyRoutes)

app.get("/", (req, res) => {
    res.send("hello from github actions")
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // console.log("success db");
        app.listen(process.env.PORT, function () {
            console.log(`connected to db and server started at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })