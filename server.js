/************************************** Start Require modules  **********************************************
 *****************************************************************************************************************/

/**
 *Express.js
 * is a framework for building web applications based on Node.js.
 * This is the standard framework for server development in Node.js.
 **/

const express = require("express");

// Grabs our environment variables from the .env file
require('dotenv').config();

const methodOverride = require('method-override');

/**
 * Node.js body parsing middleware.
 *Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
 *Note As req.body's shape is based on user-controlled input, all properties and values in this object are untrusted and should be validated before trusting. For example, req.body.foo.toString() may fail in multiple ways, for example the foo property may not be there or may not be a string, and toString may not be a function and instead a string or other user input.
 * @type {Parsers}
 */
const bodyParser = require("body-parser");

// require router
const client = require("./routes/client");
const commande = require("./routes/commande");
const magasin = require("./routes/magasin");
const employer = require("./routes/employer");
const produit = require("./routes/produit");
const avis = require("./routes/avis");
const paiement = require("./routes/paiement");
const transporteur = require("./routes/transporteur");

// require cors

/**
 Cross-Origin Resource Sharing (CORS) is a W3C specification that allows cross-domain requests from compatible browsers.
 If the API you are querying is compatible with CORS, you will be able to access the API even if it is not on the same domain as your application.

 CORS are compatible with :

 -------------------
 -------------------
 Chrome 3+
 Firefox 3.5+
 Opera 12+
 Safari 4+
 Internet Explorer 8+

 ---------------------
 ----------------------

 To use CORS it is necessary to send to the server access control headers that it will inspect to approve or not the request.
 These access control headers will describe the context of the request, its HTTP method, its origin, its custom headers, ...
 **/

const cors = require("cors");

/************************************** end  Require modules  ****************************************************
 *****************************************************************************************************************/


/********************************************************start make server with all parmars  ****************************************************
 ************************************************************************************************************************************************/

/** that the  port where you can call to use you server in local **/


const port = process.env.PORT || 5000;

// app = express
const app = express();
// in our app we use cors
app.use(cors());

// in our app we user bodyParser in json
app.use(bodyParser.json());

/**
 * store it in a variable named bodyParser. The middleware to handle url encoded data is returned by bodyParser.urlencoded({extended: false}) .
 * extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
 */

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOverride());

// Configure our Stripe secret key and object
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// we will then prixfix for our routes
// we will call every route  we need in this app here
app.use("/client", client);
app.use("/commande", commande);
app.use("/magasin", magasin);
app.use("/employer", employer);
app.use("/produit", produit);
app.use("/avis", avis);
app.use("/paiement", paiement);
app.use("/transporteur", transporteur);

// Create a server side router
var router = express.Router();

// Create a new charge
router.post('/charge', function (req, res) {
    // Create the charge object with data from the Vue.js client
    var newCharge = {
        amount: 23500,
        currency: "usd",
        source: req.body.token_from_stripe, // obtained with Stripe.js on the client side
        description: req.body.specialNote,
        receipt_email: req.body.email,
        shipping: {
            name: req.body.name,
            address: {
                line1: req.body.address.street,
                city: req.body.address.city,
                state: req.body.address.state,
                postal_code: req.body.address.zip,
                country: 'FR'
            }
        }
    };

    // Call the stripe objects helper functions to trigger a new charge
    stripe.charges.create(newCharge, function (err, charge) {
        // send response
        if (err) {
            console.error(err);
            res.json({
                error: err,
                charge: false
            });
        } else {
            // send response with charge data
            res.json({
                error: false,
                charge: charge
            });
        }
    });
});

// Route to get the data for a charge filtered by the charge's id
router.get('/charge/:id', function (req, res) {
    stripe.charges.retrieve(req.params.id, function (err, charge) {
        if (err) {
            res.json({
                error: err,
                charge: false
            });
        } else {
            res.json({
                error: false,
                charge: charge
            });
        }
    });
});

// Register the router
// app.use('/', router);


// we say our app to start listen in the port and send back to us the msg with port info
app.listen(port, function () {
    console.log("server start on " + port)
});

/******************************************************** End make server with all parmars  ****************************************************
 ************************************************************************************************************************************************/
