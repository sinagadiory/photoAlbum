const express = require("express")

const userroute = express.Router()
const controller = require("../../app/controller")

userroute.get("/users", controller.api.v1.userController.handleGetUsers)
userroute.get("/user/:id", controller.api.v1.userController.handleGetOneUser)

userroute.post("/adduser", controller.api.v1.userController.handlePostUser)

userroute.put("/updateuser/:id", controller.api.v1.userController.handleUpdateUser)

userroute.delete("/deluser/:id", controller.api.v1.userController.handleDeleteUser)

module.exports = userroute