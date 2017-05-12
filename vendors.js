const dotenv = require('dotenv').config({silent:true});
const express = require('express');
const router = express.Router();
const database = require('../config/firebase');
const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// root vendors/
router.route('/')
 .get((req,res,next)=>{
   console.log("GET with vendors")
})

.post((req,res)=>{
  console.log("******************** BODY of the POST Request ********************")
  console.log(req.body)
  console.log("******************************************************************")
  let stripeToken = req.body.stripeToken
  let amount;

  // Email configuration Tranporter. (Using mandrill to transport)
  let transporter = nodemailer.createTransport(mandrillTransport({
    auth: {
      apiKey: 'FXHz7kB9dAl5eqxavYYBlA'
    }
  }));
  
  // Build the actual template to be send in the email
  let htmlEmail = '<p>Business Name:'+req.body.businessName+'</p>' +
                  '<p>Business Email: '+req.body.businessEmail+'</p>'
  htmlEmail += '<p>Name:'+req.body.name+'</p>' +
               '<p>Phone:'+req.body.phone+'</p>'

  let mail = {
    from: 'Eventmakr <subscriptions@eventmakrvendors.com>',
    to: '<subscriptions@eventmakrvendors.com>',
    subject: 'New Eventmakr Vendor Subscription',
    html: htmlEmail
  }
  // Get reference from vendor
  let vendorRef = database.database.ref('/vendors');

  // check for unique email
  let emailIsUnique = true;
  vendorRef.once('value', snapshot => {
    let listEntry = snapshot.val()
    for (var key in listEntry) {
      if (req.body.businessEmail === snapshot.child(key).val().businessEmail) emailIsUnique = false
    }
  })

  // Validates Token on the body of the request
  if (req.body.stripeToken) {
    let vendor = req.body

    let token = req.body.stripeToken
    // Validates payment option submitted by user.
    switch (req.body.paymentOptionId) {
      case "stripe-button1":
        amount = 59;
        break;
      case "stripe-button2":
        amount = 199;
        break;
      case "stripe-button3":
        amount = 299;
        break;
      default:
        console.log("None of the payment options were click. Payment might be altered. Amount is 0")
        amount = 0;
    }
    if (emailIsUnique) {
      vendorRef.push().set(vendor)
      // send notification email of subscription
      sendNotifMail(transporter, mail);

      // Stripe charge
      let token = req.body.stripeToken;
      let charge = stripe.charges.create({
        amount: amount*100, // Amount in cents
        currency: "usd",
        capture: false,
        source: token,
        description: req.body.description
      }, (err, charge) => {
            if (err) res.status(500).send(err)
            else res.render('confirmation');
         }
      );
    } else res.render('not_valid_email', {msg: 'Business email is not unique'})
  } else res.send({msg:"invalid stripe credentials"})
})

// Send notification mail.
function sendNotifMail(transporter, mail) {
  transporter.sendMail(mail, function(error, response){
    if(error) console.log(error)
    else console.log("Message sent: " + response.accepted, response.rejected, response.messageId);

   transporter.close();
  });
}

module.exports = router
