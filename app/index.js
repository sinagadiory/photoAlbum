const express = require("express")
const router = require("../router")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cookie = require("cookie-parser")
const app = express()

dotenv.config()
app.use(cookie())
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)


module.exports = app