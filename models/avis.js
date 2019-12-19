// exporte table with all field
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "tbl_avis", {
            // field name
            idAvis: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoOncrement = true
                autoIncrement: true
            },
            note: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(1),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            commentaire: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(255),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            }
        }, {
            /**
             * By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
             */
            timestamps: true,
            /**
             * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
             * This also applies to foreign keys generated by associations.
             * */

            underscored: true
        }
    );
};
