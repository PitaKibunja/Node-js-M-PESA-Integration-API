const router = require('express').Router()
const {mpesaPassword}=require('../controllers/mpesaController')



router.get('/password', mpesaPassword)






module.exports = router