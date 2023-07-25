const {getStories, addStory} = require("../controllers/stories");   

const router = require("express").Router()

router.get('/',getStories)
router.post('/',addStory)

module.exports = router