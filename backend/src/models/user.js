"use strict";

const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
        static associate(models) {
            User.hasMany(models.Article, { foreignKey: "author_id" });
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        email: { 
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: "User",
        name: {
            singular: "user",
            plural: "users"
        }
    });
    return User;
};
