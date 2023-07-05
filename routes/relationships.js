const router = require("express").Router()
const {getRelationships,addRelationships,deleteRelationships} = require('../controllers/relationships');

router.get('/',getRelationships);
router.post('/',addRelationships);
router.delete('/',deleteRelationships);

module.exports = router