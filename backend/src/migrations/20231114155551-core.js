"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            hash: Sequelize.STRING,
        });

        await queryInterface.createTable("Articles", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false
            },
            summary: {
                type: Sequelize.STRING,
                allowNull: false
            },
            text: {
                type: Sequelize.STRING,
                allowNull: false
            },
            author_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.createTable("Tags", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        });

        await queryInterface.createTable("ArticleTags", {
            article_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: "Articles",
                    key: "id"
                }
            },
            tag_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: "Tags",
                    key: "id"
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Users");
        await queryInterface.dropTable("ArticleTags");
        await queryInterface.dropTable("Articles");
        await queryInterface.dropTable("Tags");
    }
};
