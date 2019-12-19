module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        // table name
        "contenir", {
            // field name
            quantite: {
                // set data type
                type: Sequelize.DataTypes.STRING(5)
            }
        }
    );
};
