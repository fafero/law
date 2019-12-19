var express = require('express')

var avis = express.Router()

var db = require('../database/db')

//get all avis
avis.get("/getavis", (req, res) => {
    console.log(req.body.password)
    db.avis.findAll({
            attributes: {
                include: [],
                exclude: ["idAvis"]
            },
        })
        .then(avis => {
            res.json(avis)
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })
        })
})

//add new avis
avis.post("/newavis", (req, res) => {
    if (req.body.nom) {
        db.avis.findOne({
                where: {
                    
                }
            })
            .then(avis => {
                if (!avis) {
                    db.avis.create(req.body)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                       // error: 'l'avis existe déjà'
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

//delecte avis

avis.delete('/avis/:idAvis', (req, res) => {
    db.avis.findOne({
        where: {
            idAvis: req.body.idAvis
        }
    }).then(avis => {
        if (avis) {
            db.avis.destroy({
                    where: {
                        idAvis: req.params.idAvis
                    }
                }).then(() => {
                    res.json({
                        status: "avis supprimé"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de avis")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update avis

avis.put("/avis/:idAvis", (req, res) => {
    console.log(req.param.idAvis)
    if (req.body.idAvis) {
        db.avis.update({
                note: req.body.note,
                commentaire: req.body.commentaire
            }, {
                where: {
                    idAvis: req.param.idAvis
                }
            })
            .then(() => {
                res.json("avis mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer l'avis a partir de l'idAvis

avis.get("/getidAvis/:idAvis", (req, res) => {
    console.log(req.param.idAvis)
    db.avis.findOne({
            where: {
                idAvis: req.param.idAvis
            },
        }).then(avis => {
            res.json(avis)
        })
        .catch(err => {
            res.send("l'avis n'a pas été trouvé" + err)
        })
})


module.exports = avis;