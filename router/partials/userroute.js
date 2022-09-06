const express = require("express")

const userroute = express.Router()
const controller = require("../../app/controller")

userroute.get("/users", controller.api.v1.userController.handleGetUsers)
userroute.get("/user", controller.api.v1.userController.handleGetOneUser)

userroute.post("/login", controller.api.v1.userController.handleLoginUser)
userroute.post("/register", controller.api.v1.userController.handlePostUser)


userroute.put("/updateuser/:id", controller.api.v1.userController.handleUpdateUser)

userroute.delete("/deluser/:id", controller.api.v1.userController.handleDeleteUser)

userroute.post("/logout", controller.api.v1.userController.handleLogOut)

module.exports = userroute