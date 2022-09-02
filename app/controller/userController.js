const { User } = require("../models")

const handleGetUsers = (req, res) => {
    User.findAll()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            res.status(500).json(error)
        })
}

const handleGetOneUser = (req, res) => {
    const { id } = req.params
    User.findOne({
        where: { id }
    }).then((user) => {
        res.status(200).json(user)
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handlePostUser = (req, res) => {
    const { username, email } = req.body
    User.create({
        username, email
    }).then((user) => {
        res.status(201).json(user)
    }).catch((error) => {
        res.status(500).json(error)
    })
}

const handleUpdateUser = (req, res) => {
    const { id } = req.params
    const { username, email } = req.body
    User.update({
        username, email
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

module.exports = { handleGetUsers, handleGetOneUser, handlePostUser, handleUpdateUser, handleDeleteUser }