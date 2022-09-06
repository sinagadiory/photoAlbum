const { Photo, User } = require("../../../models")
const jwt = require("jsonwebtoken")

const handleGetPhotos = async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.json({ msg: "Anda tidak diijinkan, Login Terlebih dahulu!" })
    try {
        const response = await Photo.findAll({
            include: [{ model: User }]
        })
        // res.render("pages/listPhotos", { response })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

const handleGetOnePhoto = (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.json({ msg: "Anda tidak diijinkan, Login Terlebih dahulu!" })
    const { id } = req.params
    Photo.findOne({
        include: [{ model: User }]
    }, {
        where: { id }
    }).then((foto) => {
        res.status(200).json(foto)
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handlePostPhoto = (req, res) => {
    const { title, caption, userId } = req.body
    Photo.create({
        title, caption, image_url: req.file.path, userId
    }).then((foto) => {
        // res.status(201).json(foto)
        res.redirect("/listphotos")
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleDeletePhoto = async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.json({ msg: "Anda tidak diijinkan, Login Terlebih dahulu!" })
    const { id } = req.params
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const iduser = user.userID
        const foto = await Photo.findOne({ where: { userId: iduser } })
        if (!foto) return res.json({ msg: 'Anda tidak boleh menghapus foto orang lain' })
        Photo.destroy({
            where: { id }
        }).then(() => {
            // res.status(200).json({ message: "Berhasil Dihapus!" })
            res.redirect("/photouser")
        }).catch((error) => {
            res.status(500).json(error)
        })
    } catch (error) {
        res.json(error)
    }
}

const handleUpdatePhoto = async (req, res) => {
    const { id } = req.params
    const { title, caption, } = req.body
    Photo.update({
        title, caption, image_url: req.file.path
    }, {
        where: { id }
    }).then(() => {
        // res.status(200).json({ message: "Berhasil Di Update" })
        res.redirect("/photouser")
    }).catch((error) => {
        res.status(500).json(error)
    })
}


module.exports = { handleGetPhotos, handleGetOnePhoto, handlePostPhoto, handleDeletePhoto, handleUpdatePhoto }