// exporte table with all field
module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // name of table
        "tbl_employer", {
            // field name
            idEmployer: {
                //set data type with out max length
                type: Sequelize.DataTypes.INTEGER,
                // set primaryKey = true
                primaryKey: true,
                // set autoOncrement = true
                autoIncrement: true
            },
            nom: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(100),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            prenom: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(100),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            sexe: {
                //set data type with max length
                type: Sequelize.DataTypes.ENUM("H", "F", "A"),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            date_de_naissance: {
                //set data type with max length
                type: Sequelize.DataTypes.DATE,
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            email: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(255),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false
            },
            password: {
                //set data type with max length
                type: Sequelize.DataTypes.STRING(255),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: true
            },
            adresse: {
                //set data type with out  max length
                type: Sequelize.DataTypes.STRING(255),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false,
            },
            salaire: {
                //set data type with out  max length
                type: Sequelize.DataTypes.STRING(5),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false,
            },
            telephone: {
                //set data type with out  max length
                type: Sequelize.DataTypes.STRING(10),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false,
            },
            poste: {
                //set data type with out  max length
                type: Sequelize.DataTypes.STRING(50),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false,
            },
            qualification: {
                //set data type with out  max length
                type: Sequelize.DataTypes.STRING(50),
                // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
                allowNull: false,
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
