const express = require("express")
const { photoroute, userroute, viewroute } = require("./partials")
const router = express.Router()

router.use(viewroute)
router.use(photoroute)
router.use(userroute)


module.exports = router