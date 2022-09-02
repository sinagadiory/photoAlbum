const express = require("express")

const userroute = express.Router()
const { userController } = require("../../app/controller")

userroute.get("/users", userController.handleGetUsers)
userroute.get("/user/:id", userController.handleGetOneUser)

userroute.post("/adduser", userController.handlePostUser)

userroute.put("/updateuser/:id", userController.handleUpdateUser)

userroute.delete("/deluser/:id", userController.handleDeleteUser)

module.exports = userroute