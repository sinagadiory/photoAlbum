const express = require("express")
const { photoroute, userroute, viewroute } = require("./partials")
const router = express.Router()
const controller = require("../app/controller")

router.use(viewroute)
router.use(photoroute)
router.use(userroute)
router.use(controller.api.main.onLost)
router.use(controller.api.main.onError)

module.exports = router