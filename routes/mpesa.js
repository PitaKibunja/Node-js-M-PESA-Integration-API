const router = require('express').Router()
const {mpesaPassword,token,stkPush}=require('../controllers/mpesaController')



router.get('/password', mpesaPassword)

router.post('/stk/push', token,stkPush)




module.exports = router