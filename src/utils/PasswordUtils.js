const bcrypt = require('bcryptjs');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function comparePassword(inputPassword, hashPassword) {
    return bcrypt.compareSync(inputPassword, hashPassword);
}

module.exports = { hashPassword, comparePassword };