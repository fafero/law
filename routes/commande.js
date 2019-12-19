var express = require('express')

var commande = express.Router()

var db = require('../database/db')

const Sequelise = require("../database/db");
const Op = Sequelise.Op;

commande.get("/find/:num", (req, res) => {
    db.commande.findAll({
            where: {
                [Op.or]: [{
                    num: req.params.num
                }]
            }
        })
        .then(client => {
            res.json(commande);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
})

//get all commande
commande.get("/getcommande", (req, res) => {
    db.commande.findAll({
            attributes: {
                include: [],
                exclude: ["num"]
            },
        })
        .then(commande => {
            res.json(commande)
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })
        })
})

// add new commande

commande.post("/newcommande", (req, res) => {

    const clientdata = {
        client: req.body.client
    };
    //try to find client
    db.client.findOne({
            where: {
                idClient: req.body.idClient
            }
        })
        .then(client => {
            // if client exist then
            if (client) {
                const commandedata = {
                    nbr_produit: req.body.nbr_produit,
                    prix_total: req.body.prix_total,
                    date_commande: req.body.date_commande
                };
                 // we try to find if commande allready in database
                db.commande.findOne({
                where: {
                    num: req.body.num
                }
                    }).then(commande => {
                        // if commande not exist then
                        if (!commande) {
                            // we create new one in database
                            db.commande.create(commandedata)
                                .then(rescommande => {
                                   // then we sand back
                                   res.json(rescommande);
                            })
                                    .catch(err => {
                                        // if error catch and then send back
                                        res.json('error' + err)
                                    })
                                    }
                                    // send back message to informe that commande is allready in database
                                    else {
                                        res.json('commande allready in database');
                                    }
                                })
                                // catch if error and send back
                                .catch(err => {
                                    res.json('error' + err)
                                })
                        } else {
                            // if client not in data base so user have to add before add commande to datalist
                            res.json('add client before to add your commande ')
                        }
                    })
                    // catch if error
                    .catch(err => {
                        // send back if error
                        res.json("error" + err);
                    })
            });

//delecte commande

commande.delete('/deletecommande/:num', (req, res) => {
    db.commande.findOne({
        where: {
            num: req.body.num
        }
    }).then(commande => {
        if (commande) {
            db.commande.destroy({
                    where: {
                        num: req.params.num
                    }
                }).then(() => {
                    res.json({
                        status: "commande supprimée"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de commande")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update commande

commande.put("/updatecommande/:num", (req, res) => {
    console.log(req.param.num)
    if (req.body.num) {
        db.commande.update({
                nbr_produit: req.body.nbr_produit,
                prix_total: req.body.prix_total
            }, {
                where: {
                    num: req.param.num
                }
            })
            .then(() => {
                res.json("commande mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer le commande a partir du num

commande.get("/getnumcommande/:num", (req, res) => {
    console.log(req.param.num)
    db.commande.findOne({
            where: {
                num: req.param.num
            },
        }).then(commande => {
            res.json(commande)
        })
        .catch(err => {
            res.send("la commande n'a pas été trouvé" + err)
        })
})


module.exports = commande;