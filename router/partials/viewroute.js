const axios = require("axios")
const express = require("express")
const { User, Photo } = require("../../app/models")


const viewroute = express.Router()

viewroute.get("/addphoto", (req, res) => {
    res.render("pages/addPhoto")
})
viewroute.get("/listphotos", (req, res) => {
    Photo.findAll({
        include: [{ model: User }]
    }).then((response) => {
        res.render("pages/listPhotos", { response })
    })
})

viewroute.get("/adduser", (req, res) => {
    res.render("pages/addUser")
})
module.exports = viewroute