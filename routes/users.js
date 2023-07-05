const router = require("express").Router()
const {getUser,updateUser} = require('../controllers/users');

router.get('/find/:userId',getUser)
router.put('/',updateUser)

module.exports = router