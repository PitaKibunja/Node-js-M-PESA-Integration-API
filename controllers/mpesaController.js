require('dotenv').config()
const datetime=require('node-datetime')
const passKey=process.env.PASSKEY
const shortCode=process.env.SHORTCODE
const consumerKey=process.env.CONSUMERKEY
const consumerSecret=process.env.CONSUMERSECRET
const axios = require('axios')

const newPassword = () => {
    const dt = datetime.create()
    //format date-time to the required format by m-pesa
    const formartted = dt.format('YmdHMS')
    
    //get the password string by concatinating all the variables
    const passString = shortCode + passKey + formartted
    //encode the password into a base64 string which mpesa accepts.
    const base64EncodedPassword=Buffer.from(passString).toString('base64')
    //return this to be used in the password generation function below
    return base64EncodedPassword
}

//generate the token
exports.token = (req, res,next) => {
    const url =  'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    auth = 'Basic ' + Buffer.from(consumerKey + ':' + consumerSecret).toString('base64')
    
    var config = {
        method: 'get',
        url,
        headers: { 
          'Authorization': auth
        }
      };
      
      axios(config)
      .then(function (response) {
          console.log(JSON.stringify(response.data));
          next()
      })
      .catch(function (error) {
        console.log(error);
      });
}

//return the password
exports.mpesaPassword = (req, res) => {
    res.send(newPassword())
    
}

exports.stkPush = (req, res) => {
    res.send("It is done")
}