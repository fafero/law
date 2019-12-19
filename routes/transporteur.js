var express = require('express')

var transporteur = express.Router()

var db = require('../database/db')

//get all transporteur
transporteur.get("/gettransporteur", (req, res) => {
    db.transporteur.findAll({
            attributes: {
                include: [],
                exclude: ["idTransporteur"]
            },
        })
        .then(transporteur => {
            res.json(transporteur)
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })
        })
})

//add new transporteur
transporteur.post("/newtransporteur", (req, res) => {
    if (req.body.nom) {
        db.transporteur.findOne({
                where: {

                }
            })
            .then(transporteur => {
                if (!transporteur) {
                    db.transporteur.create(req.body)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                        // error: 'l'transporteur existe déjà'
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

//delecte transporteur

transporteur.delete('/transporteur/:idTransporteur', (req, res) => {
    db.transporteur.findOne({
        where: {
            idTransporteur: req.body.idTransporteur
        }
    }).then(transporteur => {
        if (transporteur) {
            db.transporteur.destroy({
                    where: {
                        idTransporteur: req.params.idTransporteur
                    }
                }).then(() => {
                    res.json({
                        status: "transporteur supprimé"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de transporteur")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update transporteur

transporteur.put("/transporteur/:idTransporteur", (req, res) => {
    console.log(req.param.idTransporteur)
    if (req.body.nom) {
        db.transporteur.update({
                     nom: req.body.nom,
                     prenom: req.body.prenom,
                     sexe: req.body.sexe,
                     date_de_naissance: req.body.date_de_naissance,
                     email: req.body.email,
                     password: req.body.password,
                     adresse: req.body.adresse,
                     telephone: req.body.telephone
            }, {
                where: {
                    idTransporteur: req.param.idTransporteur
                }
            })
            .then(() => {
                res.json("transporteur mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer le transporteur a partir de l'idTransporteur

transporteur.get("/getidTransporteur/:idTransporteur", (req, res) => {
    console.log(req.param.idTransporteur)
    db.transporteur.findOne({
            where: {
                idTransporteur: req.param.idTransporteur
            },
        }).then(transporteur => {
            res.json(transporteur)
        })
        .catch(err => {
            res.send("le transporteur n'a pas été trouvé" + err)
        })
})


module.exports = transporteur;