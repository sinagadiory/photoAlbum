const express = require("express")
const { User, Photo } = require("../../app/models")
const jwt = require("jsonwebtoken")

const viewroute = express.Router()

viewroute.get("/", (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.redirect("/login")
    return res.redirect("/listphotos")
})

viewroute.get("/addphoto", async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.redirect("/login")
    try {
        const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        res.render("pages/addPhoto", { user })
    } catch (error) {
        res.redirect("/login")
    }
})
viewroute.get("/listphotos", async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.redirect("/login")
    try {
        const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        Photo.findAll({
            include: [{ model: User }]
        }).then((response) => {
            res.render("pages/listPhotos", { response, user })
        })
    } catch (error) {
        res.redirect("/login")
    }
})

viewroute.get("/photouser", async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.redirect("/login")
    try {
        const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        Photo.findAll({
            where: { userId: user.userID }
        }).then((response) => {
            res.render("pages/photoUser", { response, user })
            // res.json(response)
        })
        // res.json(user)
    } catch (error) {
        res.redirect("/login")
    }
})

viewroute.get("/updatephoto/:id", async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.redirect("/login")
    const { id } = req.params
    const cek = await Photo.findOne({ where: { id } })
    if (cek == null) {
        res.json({ msg: "Foto Tidak Ditemukan" })
        return
    }
    try {
        const user = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        Photo.findOne({
            where: { id }
        }).then((response) => {
            if (response.userId != user.userID) {
                res.json({ msg: "Anda tidak diperbolehkan mengedit foto orang lain!" })
                return
            }
            res.render("pages/updatePhoto", { response, user, id })
            // res.json(response)
        })
        // res.json(user)
    } catch (error) {
        res.redirect("/login")
    }
})

viewroute.get("/register", (req, res) => {
    res.render("pages/addUser")
})

viewroute.get("/login", (req, res) => {
    res.render("pages/login")
})


module.exports = viewroute