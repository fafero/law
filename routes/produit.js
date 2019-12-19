var express = require('express')

var produit = express.Router()

var db = require('../database/db')

//get all produit
produit.get("/All", (req, res) => {
    console.log(req.body.reference)
    db.produit.findAll({
            attributes: {
                include: [],
                exclude: ["created_at", "updated_at"]
            }
        })
        .then(produits => {
            res.json(produits)
            })
                .catch(err => { //le catch montre l'erreur au lieu de planter
                    res.send('error' + err)
                })
        
});

//add new produit
produit.post("/newproduit", (req, res) => {
    if (req.body.reference) {
        db.produit.findOne({
                where: {
                    libelle: req.body.libelle
                }
            })
            .then(produit => {
                if (!produit) {
                    db.produit.create(req.body)
                        .then(data => {
                            res.send(data)
                        })
                        .catch(err => { //le catch montre l'erreur au lieu de planter
                            res.json('error' + err)
                        })
                } else {
                    res.json({
                        error: 'le produit existe déjà'
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

//delecte produit

produit.delete('/produit/:reference', (req, res) => {
    db.produit.findOne({
        where: {
            reference: req.body.reference
        }
    }).then(produit => {
        if (produit) {
            db.produit.destroy({
                    where: {
                        reference: req.params.reference
                    }
                }).then(() => {
                    res.json({
                        status: "produit supprimé"
                    })
                })
                .catch(err => {
                    res.send("error" + err)
                })
        } else {
            res.json("Pas de produit")
        }
    }).catch(err => {
        res.send("error" + err)
    })

})

//update produit

produit.put("/produit/:reference", (req, res) => {
    console.log(req.param.reference)
    if (req.body.libelle) {
        db.produit.update({
                libelle: req.body.libelle,
                description: req.body.description,
                prix: req.body.prix,
                taille: req.body.taille,
                quantite: req.body.quantite
            }, {
                where: {
                    reference: req.param.reference
                }
            })
            .then(() => {
                res.json("produit mise à jour")
            })
    } else {
        res.status(400)
        res.json({
            error: "bad data"
        })
    }
})

//recuperer le produit a partir de la reference

produit.get("/getreference/:reference", (req, res) => {
    console.log(req.param.reference)
    db.produit.findOne({
            where: {
                reference: req.param.reference
            },
        }).then(produit => {
            res.json(produit)
        })
        .catch(err => {
            res.send("le produit n'a pas été trouvé" + err)
        })
});

//recuperer le produit a partir de la description

produit.get("/findbydescription/:description", (req, res) => {
    console.log(req.params.description)
    db.produit.findAll({
            attributes: {
                include: [],
                exclude: []
            },
            where: {
                description: req.params.description
            }
        })
        .then(produit => {
            res.json(produit)
        })
        .catch(err => { //le catch montre l'erreur au lieu de planter
            res.send('error' + err)
        })
})


module.exports = produit;