const express = require("express")
const router = require("../router")
const bodyParser = require("body-parser")

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)


module.exports = app