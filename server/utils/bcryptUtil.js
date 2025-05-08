const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (password) => {
    return bcrypt.hash(password, saltRounds);
};

const comparePassword = (inputPassword, hashedPassword) => {
    return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
