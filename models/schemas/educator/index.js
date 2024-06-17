const { DataTypes } = require('sequelize');


module.exports = (dbConfig, Sequelize) => {
    const educatorSchema = dbConfig.define('educator',
        {

            educatorId: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            fName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email address already in use!',
                },

            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastLogin: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            createdAt: 'hireDate',
            updatedAt: false
        }
    );
    return educatorSchema
}