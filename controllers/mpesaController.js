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
        url:url,
        headers: { 
          'Authorization': auth
        }
      };
      
      axios(config)
      .then(function (response) {
          let data = response.data;
          let access_token = data.access_token
          //capture the generated token to be used by the next request (stkPush req)
          req.token = access_token
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

exports.stkPush = (req, res,next) => {
    const token=req.token
    // res.send(token)
    const auth = 'Bearer ' + token
    //create a datetime to authenticate the request.
    const dt = datetime.create()
    //format date-time to the required format by m-pesa
    const formarttedTime = dt.format('YmdHMS')
    var data = JSON.stringify({
        "BusinessShortCode": "174379",
        "Password": newPassword(),
        "Timestamp": formarttedTime,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": "1",
        "PartyA": "254717856149",
        "PartyB": "174379",
        "PhoneNumber": "254717856149",
        "CallBackURL": "https://mydomain.com/path",
        "AccountReference": "ACK Kirangari Church Donation",
        "TransactionDesc": "lipa na M-PESA"
      });
      
      var config = {
        method: 'post',
        url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        headers: { 
          'Authorization': auth, 
          'Content-Type': 'application/json'
        },
        data : data
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