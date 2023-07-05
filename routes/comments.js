const router = require("express").Router()
const {getComments,addComment} = require('../controllers/comments');

router.get('/',getComments);
router.post('/',addComment);

module.exports = router