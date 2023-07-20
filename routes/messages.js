const router = require("express").Router()
const {getMessages} = require('../controllers/messages');

router.get('/',getMessages);

module.exports = router