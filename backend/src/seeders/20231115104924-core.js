"use strict";


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        await queryInterface.bulkInsert("Users", [{
            id: "e690f04d-1693-4b30-bc7c-9e073b642b28",
            email: "zachary@example.com",
            name: "Zachary Whiteley",
            hash: "$2a$12$SemhO1X60sDM5LnXfeEXc.dJQJ6b6gMcVay2hj3po/JeTE8CnO5Ee"
        }]);

        await queryInterface.bulkInsert("Articles", [{
            id: 1,
            title: "The Rust Newtype Pattern",
            summary: "Discusses what the Rust newtype pattern is, how to do it, and its benefits and drawbacks",
            text: "The Rust newtype pattern is one of the most popular patterns in the Rust programming language",
            image_id: "e690f04d-1693-4b30-bc7c-9e073b642b28",
            author_id: "e690f04d-1693-4b30-bc7c-9e073b642b28",
            created_at: new Date(2023, 10, 10)
        }]);

        await queryInterface.bulkInsert("Tags", [
            { id: 1, name: "Rust" },
            { id: 2, name: "Design Patterns" },
            { id: 3, name: "React" }
        ]);

        await queryInterface.bulkInsert("ArticleTags", [
            { article_id: 1, tag_id: 1 },
            { article_id: 1, tag_id: 2 },
        ]);
    },

    async down (queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete("ArticleTags");
        await queryInterface.bulkDelete("Articles");
        await queryInterface.bulkDelete("Tags");
        await queryInterface.bulkDelete("Users");
    }
};
