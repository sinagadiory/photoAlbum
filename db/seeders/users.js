'use strict';
const bcrypt = require("bcrypt")
const hashpassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const result = bcrypt.hashSync(password, salt)
    return result
}
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         * 
        */
        await queryInterface.bulkInsert('Users', [{
            username: "diory_pribadi",
            email: "sinagadiory@gmail.com",
            password: hashpassword("12345"),
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
