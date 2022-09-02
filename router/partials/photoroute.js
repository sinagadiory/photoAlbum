const express = require("express")

const photoroute = express.Router()
// const { controller.api.v1.photoController } = require("../../app/controller.api/api/v1/index")
const controller = require("../../app/controller")
const cloudinary = require("../../config/cloudinary")
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "GambarExpressPhotos",
    },
});

const upload = multer({ storage: storage });

photoroute.get("/", (req, res) => {
    res.send("Halo")
})

photoroute.get("/photos", controller.api.v1.photoController.handleGetPhotos)
photoroute.get("/photo/:id", controller.api.v1.photoController.handleGetOnePhoto)

photoroute.post("/addphoto", upload.single("image_url"), controller.api.v1.photoController.handlePostPhoto)

photoroute.delete("/delphoto/:id", controller.api.v1.photoController.handleDeletePhoto)

photoroute.put("/update/:id", upload.single("image_url"), controller.api.v1.photoController.handleUpdatePhoto)

module.exports = photoroute
