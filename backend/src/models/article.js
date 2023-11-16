"use strict";

const {
    Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            Article.belongsTo(models.User, { as: "author", foreignKey: "author_id" });
            Article.belongsToMany(models.Tag, { through: "ArticleTags" });
        }
    }

    Article.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        author_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id"
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: "Article",
        name: {
            singular: "article",
            plural: "articles"
        }
    });
    return Article;
};
