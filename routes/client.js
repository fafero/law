/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
/**
 *Express.js
 * is a framework for building web applications based on Node.js.
 * This is the standard framework for server development in Node.js.
 **/
const express = require("express");
/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * client.METHOD (PATH, HANDLER)
 *
 *  GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 * @type { Router }
 */
const client = express.Router();
//create db
const db =require("../database/db");

const Sequelize = require("../database/db");
const Op = Sequelize.Op;

const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

process.env.SECRET_KEY = "secret";


//find
client.get("/find/:email/:id", (req, res) => {
    db.client.findAll({
            where: {
                [Op.or]: [{
                    id: req.params.id
                }, {
                    email: req.params.email
                }]
            }
        })
        .then(client => {
            res.json(client);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

client.get("/one/:idClient", (req, res) => {
    db.client.findAll({
            where: {
                idClient: req.params.idClient
            }
        })
        .then(client => {
            res.json(client);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
})

/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start client router ****************************************************
 *****************************************************************************************************************/


// get All clients without commande
client.get("/All", (req, res) => {
    // Find all clients without there commande
    db.client.findAll({
            // if you need you use
            attributes: {
                include: [],
                exclude: []
            },
        })
        // get list of clients All clients in your database
        .then(clients => {
            // send back respose in json liste of clients
            res.json(clients)
        })
        // catch error if something happend
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});

//get All clients and them commandes

client.get("/getAll", (req, res) => {
    // Find All client with there commandes
    db.client.findAll({
            all: true,
            attributes: {
                include: [],
                // don't need to show this filed
                exclude: ["updated_at", "created_at"]
            },
            include: [{
                // get commande of clients
                commande: db.commandes,
                include: [{
                    paiement: db.paiement,
                }],
                attributes: {
                    include: [],
                    // don't need to show this filed
                    exclude: ["idClient", "updated_at", "created_at"]
                },
            }],
        })
        // get clients
        .then(clients => {
            // send back clients
            res.json(clients);
        })
        // if error catch if and send back for user app to show him if some error
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});

//create new client
client.post("/newclient", (req, res) => {
    // create data client if need to add new data in table client
    const clientdata = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            sexe: req.body.sexe,
            date_de_naissance: req.body.date_de_naissance,
            email: req.body.email,
            password: req.body.password,
            adresse: req.body.adresse,
            admin: req.body.admin
    }
    if (req.body.email) {
        db.client.findOne({
                where: {
                    email: req.body.email
                }
            })
            .then(client => {
                if (!client) {
                    // make hash of password in bcrypt, salt 10
                    const hash = bcrypt.hashSync(clientdata.password, 10);
                    clientdata.password = hash;
                    db.client.create(clientdata)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                        error: 'le client existe déjà'
                    })
                }
            })
            .catch(
                err => {
                    res.json('error' + err)
                }
            )
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})


// login
client.post("/login", (req, res) => {
    db.client.findOne({
        where: {email: req.body.email}
    })
        .then(clientdata => {
            if (bcrypt.compareSync(req.body.password, clientdata.password)) {
                let token = jwt.sign(clientdata.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.json({token:token})
            } else {
                res.send('error mail or error password')
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


// update client in params his id
//  exmple : localhost:{your port}/{you préfix}/{name_client}/{id }
client.put("/updateclient/:idClient", (req, res) => {
    // find one client
    db.client.findOne({
            where: {
                idClient: req.params.idClient
            }
        })
        // if this clients allready in your database then update
        .then(() => {
            // make update client with body and id parmas
            db.client.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    sexe: req.body.sexe,
                    date_de_naissance: req.body.date_de_naissance,
                    email: req.body.email,
                    password: req.body.password,
                    adresse: req.body.adresse
                }, {
                    where: {
                        idClient: req.params.idClient
                    },
                    returning: true,
                    plain: true
                })
                //
                .then(() => {
                    // then find this you upadate to get back new data of your clients whit
                    db.client.findOne({
                            where: {
                                idClient: req.params.idClient
                            }
                        })
                        .then(client => {
                            res.send(client);
                        })
                        .catch(err => {
                            res.json({
                                error: "error" + err
                            })
                        })
                })
                .catch(err => {
                    res.json("error" + err)
                })
        })
        .catch(err => {
            res.json({
                error: "can't update client" + err
            })
        })
});

// delete  one client
client.delete("/deleteclient/:idClient", (req, res) => {
    //find one client where id = id
    db.client.findOne({
            where: {
                idClient: req.params.idClient
            }
        })
        // then get var client
        .then((client) => {
            // if not client
            if (!client) {
                // send back error message error
                // respose in json send back error : this client not existe in your liste so you can't delete
                res.json({
                    error: "this client not existe in your base"
                })
            } else {
                // if client existe so delete it where id = params.id
                client.destroy()
                    // send back message in json to confime that your client is deleeted !
                    .then(() => {
                        res.json({
                            status: "client deleted"
                        })
                    })
                    // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
                    .catch(err => {
                        res.json({
                            error: "error" + err
                        })
                    })
            }
        })
        // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })
});


module.exports = client;

/************************************** end route client ****************************************************
 /*****************************************************************************************************************/
