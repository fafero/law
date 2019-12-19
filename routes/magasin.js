var express = require('express')

var magasin = express.Router()

var db = require('../database/db')

//get all magasin
magasin.get("/getmagasin", (req, res) => {
    db.magasin.findAll({
            attributes: {
                include: [],
                exclude: []
            },
        })
        .then(magasin => {
            res.json(magasin)
            })
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })
        
})

//add new magasin
magasin.post("/newmagasin", (req, res) => {
    if (req.body.nom) {
        db.magasin.findOne({
                where: {
                    nom: req.body.nom
                }
            })
            .then(magasin => {
                if (!magasin) {
                    db.magasin.create(req.body)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                        error: 'le magasin existe déjà'
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

//delecte magasin

magasin.delete('/magasin/:idMagasin', (req, res) => {
    db.magasin.findOne({
        where: {
            idMagasin: req.body.idMagasin
        }
    }).then(magasin => {
        if (magasin) {
            db.magasin.destroy({
                    where: {
                        idMagasin: req.params.idMagasin
                    }
                }).then(() => {
                    res.json({
                        status: "magasin supprimé"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de magasin")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update magasin

magasin.put("/magasin/:idMagasin", (req, res) => {
    console.log(req.param.idMagasin)
    if (req.body.nom) {
        db.magasin.update({
                nom: req.body.nom,
                nbr_employer: req.body.nbr_employer,
                responsable: req.body.responsable,
                adresse: req.body.adresse
            }, {
                where: {
                    idMagasin: req.param.idMagasin
                }
            })
            .then(() => {
                res.json("magasin mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer le magasin a partir de l'id

magasin.get("/getidMagasin/:idMagasin", (req, res) => {
    console.log(req.param.idMagasin)
    db.magasin.findOne({
            where: {
                idMagasin: req.param.idMagasin
            },
        }).then(magasin => {
            res.json(magasin)
        })
        .catch(err => {
            res.send("le magasin n'a pas été trouvé" + err)
        })
})


module.exports = magasin;