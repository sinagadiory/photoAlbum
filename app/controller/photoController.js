const { Photo, User } = require("../models")

const handleGetPhotos = async (req, res) => {
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
        res.status(201).json(foto)
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleDeletePhoto = (req, res) => {
    const { id } = req.params
    Photo.destroy({
        where: { id }
    }).then(() => {
        res.status(200).json({ message: "Berhasil Dihapus!" })
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleUpdatePhoto = async (req, res) => {
    const { id } = req.params
    const { title, caption, } = req.body
    Photo.update({
        title, caption, image_url: req.file.path
    }, {
        where: { id }
    }).then(() => {
        res.status(200).json({ message: "Berhasil Di Update" })
    }).catch((error) => {
        res.status(500).json(error)
    })
}


module.exports = { handleGetPhotos, handleGetOnePhoto, handlePostPhoto, handleDeletePhoto, handleUpdatePhoto }