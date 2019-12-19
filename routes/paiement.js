var express = require('express')

var paiement = express.Router()

var db = require('../database/db')

//get all paiement
paiement.get("/getpaiement", (req, res) => {
    console.log(req.body.password)
    db.paiement.findAll({
            attributes: {
                include: [],
                exclude: ["idPaiement"]
            },
        })
        .then(paiement => {
            res.json(paiement)
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })              
        })
})

//add new paiement
paiement.post("/newpaiement", (req, res) => {
    if (req.body.nom) {
        db.paiement.findOne({
                where: {
                    libelle: req.body.libelle
                }
            })
            .then(paiement => {
                if (!paiement) {
                    db.paiement.create(req.body)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                        error: 'le paiement existe déjà'
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

//delecte paiement

paiement.delete('/paiement/:idPaiement', (req, res) => {
    db.paiement.findOne({
        where: {
            idPaiement: req.body.idPaiement
        }
    }).then(paiement => {
        if (paiement) {
            db.paiement.destroy({
                    where: {
                        idPaiement: req.params.idPaiement
                    }
                }).then(() => {
                    res.json({
                        status: "paiement supprimé"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de paiement")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update paiement

paiement.put("/paiement/:idPaiement", (req, res) => {
    console.log(req.param.idPaiement)
    if (req.body.libelle) {
        db.paiement.update({
                libelle: req.body.libelle,
                description: req.body.description,
                prix: req.body.prix,
                taille: req.body.taille
            }, {
                where: {
                    idPaiement: req.param.idPaiement
                }
            })
            .then(() => {
                res.json("paiement mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer le paiement a partir de la idPaiement

paiement.get("/getidPaiement/:idPaiement", (req, res) => {
    console.log(req.param.idPaiement)
    db.paiement.findOne({
            where: {
                idPaiement: req.param.idPaiement
            },
        }).then(paiement => {
            res.json(paiement)
        })
        .catch(err => {
            res.send("le paiement n'a pas été trouvé" + err)
        })
})


module.exports = paiement;