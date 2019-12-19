/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
 *
 * * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
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
const employer = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

process.env.SECRET_KEY = "secret";

// get All employer 
employer.get("/All", (req, res) => {
    // Find all employer
    db.employer.findAll({
            // if you need you use
            attributes: {
                include: [],
                exclude: ["created_at", "updated_at"]
            },
        })
        // get list of clients All clients in your database
        .then(employers => {
            // send back respose in json liste of clients
            res.json(employers)
        })
        // catch error if something happend
        .catch(err => {
            // send back error
            res.send("error" + err)
        })
});


// register
employer.post("/register", (req, res) => {
    const empdata = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        sexe: req.body.sexe,
        date_de_naissance: req.body.date_de_naissance,
        email: req.body.email,
        password: req.body.password,
        adresse: req.body.adresse,
        salaire: req.body.salaire,
        telephone: req.body.telephone,
        poste: req.body.poste,
        qualification: req.body.qualification,
        admin: req.body.admin
       
    };
    // find if user existe  or not
    // select * from tbl_user where email = 'toto@toto.fr'
    db.employer.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(emp => {
            if (!emp) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(empdata.password, 10);
                empdata.password = hash;
                db.employer.create(empdata)
                    .then(emp => {
                        let token = jwt.sign(emp.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.json({
                            token: token
                        })
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "employer already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});

// login
employer.post("/login", (req, res) => {
    db.employer.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(employerdata => {
            if (bcrypt.compareSync(req.body.password, employerdata.password)) {
                let token = jwt.sign(employerdata.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                employer.admin = true;
                res.json({
                    token: token
                })
            } else {
                res.send('error mail or error password')
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


// update
employer.post("/update", (req, res) => {
    db.employer.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(emp => {
            if (emp) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.password, 10);
                emp.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    sexe: req.body.sexe,
                    date_de_naissance: req.body.date_de_naissance,
                    email: req.body.email,
                    password: req.body.password,
                    adresse: req.body.adresse,
                    salaire: req.body.salaire,
                    telephone: req.body.telephone,
                    poste: req.body.poste,
                    qualification: req.body.qualification
                })
            } else {
                res.json({
                    error: "can't update this employe his is not your epmloye"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

// update
employer.post("/update/:idEmployer", (req, res) => {
    db.emp.findOne({
            where: {
                email: req.params.id
            }
        })
        .then(employer => {
            if (employer) {
                // make hash of password in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.password, 10);
                employer.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    password: hash,
                    competences: req.body.competences,
                    poste: req.body.poste,
                    salaire: req.body.salaire,
                    telephone: req.body.telephone,
                    poste: req.body.poste,
                    qualification: req.body.qualification
                })
            } else {
                res.json({
                    error: "can't update this employe his is not your epmloye"
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});



// delete emp
employer.delete("/delete/:idEmployer", (req, res) => {
    // find the employe you want you delete
    db.employer.findOne({
            where: {
                id: req.params.idEmployer
            }
        }).then(employer => {
            // if pieces exist so
            if (employer) {
                // delete this pieces
                employer.destroy().then(() => {
                        // send back the  confirmation of  employe is deleted
                        res.json("employe deleted")
                    })
                    // catch if error
                    .catch(err => {
                        // send back the error to info that in json
                        res.json("error" + err)
                    })
            } else {
                // send back the error message to info that you can't deleted this emp it not exist in your database
                res.json({
                    error: "you can't delete this employe it not exist in you list of employes"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});


// delete emp
employer.delete("/deleteBy/:email", (req, res) => {
    // find the employe you want you delete
    db.employer.findOne({
            where: {
                id: req.params.email
            }
        }).then(employer => {
            // if pieces exist so
            if (employer) {
                // delete this pieces
                employer.destroy().then(() => {
                        // send back the  confirmation of  employe is deleted
                        res.json("employe deleted")
                    })
                    // catch if error
                    .catch(err => {
                        // send back the error to info that in json
                        res.json("error" + err)
                    })
            } else {
                // send back the error message to info that you can't deleted this emp it not exist in your database
                res.json({
                    error: "you can't delete this employe it not exist in you list of employes"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});

// find by email emp
employer.get("/Find/:email", (req, res) => {
    // find the employe by email
    db.employer.findOne({
            where: {
                id: req.params.email
            }
        }).then(employer => {
            // if pieces exist so
            if (employer) {
                res.json({
                    employe: employer
                })
            } else {
                // send back this emp it not exist in your database
                res.json({
                    error: "This employe  exist in you list of employes"
                })
            }
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});

employer.get("/All", (req, res) => {
    // find the employe by email
    db.employer.findAll({
        attributes: {
            exclude: ["password", "created_at", "updated_at"]
        }
    }).
    then(employers => {
            res.json(employers)
        })
        .catch(err => {
            // send back the message error
            res.json("error" + err);
        })
});

module.exports = employer;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/




                
 