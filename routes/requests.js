const {getRequests,addRequest,acceptRequest,declineRequest} = require("../controllers/requests");   

const router = require("express").Router()

router.get('/',getRequests)
router.post('/',addRequest)
router.post('/accept',acceptRequest)
router.post('/decline',declineRequest)

module.exports = router