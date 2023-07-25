const router = require("express").Router()
const {getAllUsers,getUser,updateUser} = require('../controllers/users');

router.get('/find',getAllUsers)
router.get('/find/:userId',getUser)
router.put('/',updateUser)

module.exports = router