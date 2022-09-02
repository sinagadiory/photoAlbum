const express = require("express")

const photoroute = express.Router()
const { photoController } = require("../../app/controller/index")
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

photoroute.get("/photos", photoController.handleGetPhotos)
photoroute.get("/photo/:id", photoController.handleGetOnePhoto)

photoroute.post("/addphoto", upload.single("image_url"), photoController.handlePostPhoto)

photoroute.delete("/delphoto/:id", photoController.handleDeletePhoto)

photoroute.put("/update/:id", upload.single("image_url"), photoController.handleUpdatePhoto)

module.exports = photoroute
