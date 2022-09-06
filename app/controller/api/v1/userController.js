const { User } = require("../../../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const handleGetUsers = (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.json({ msg: "Anda tidak diijinkan, Login Terlebih dahulu!" })
    User.findAll()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            res.status(500).json(error)
        })
}

const handleGetOneUser = (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.json({ msg: "Login Terlebih dahulu!" })
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        User.findOne({
            where: { id: user.userID }
        }).then((user) => {
            res.status(200).json({ user })
        }).catch((error) => {
            res.status(500).json(error)
        })
    } catch (error) {
        res.json({ msg: "Login Terlebih Dahulu!" })
    }
}

const handlePostUser = async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (user != null) return res.json({ msg: "Maaf email sudah terdaftar" })
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)
    User.create({
        username, email, password: hashpassword
    }).then((user) => {
        // res.status(201).json(user)
        res.redirect("/login")
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleLoginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.json({ msg: "email dan password tidak cocok" })
    const cekpassword = await bcrypt.compare(password, user.password)
    if (cekpassword == false) return res.json({ msg: "email dan password tidak cocok" })
    const userID = user.id
    const username = user.username
    const accessToken = jwt.sign({ userID, username, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true
    });
    // res.json({ accessToken })
    // res.render("pages/addPhoto")
    res.redirect("/listphotos")
}

const authentication = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.status(401).json({ msg: "Dilarang!" })
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Dilarang!" })
        req.user = user
        next()
    })
}

const handleLogOut = (req, res) => {
    res.clearCookie("accessToken")
    res.redirect("/login")
}

const handleUpdateUser = async (req, res) => {
    const { id } = req.params
    const { username, email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)
    User.update({
        username, email, password: hashpassword
    }, {
        where: { id }
    }).then(() => {
        res.status(200).json({ message: "Berhasil Di Updated" })
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleDeleteUser = (req, res) => {
    const { id } = req.params
    User.destroy({
        where: { id }
    }).then(() => {
        res.status(200).json({ message: "Berhasil di Hapus" })
    }).catch((error) => {
        res.status(500).json(error)
    })
}

module.exports = { handleGetUsers, handleGetOneUser, handlePostUser, handleUpdateUser, handleDeleteUser, handleLoginUser, authentication, handleLogOut }