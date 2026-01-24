const crypto = require('crypto');

/**
 * Generate a random salt
 */
const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

/**
 * Hash password with salt
 * @param {string} password 
 * @param {string} salt 
 */
const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

/**
 * Verify password
 * @param {string} password - Input password
 * @param {string} hash - Stored hash
 * @param {string} salt - Stored salt
 */
const verifyPassword = (password, hash, salt) => {
    const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return newHash === hash;
};

/**
 * Generate random 8-char password
 */
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
};

module.exports = {
    generateSalt,
    hashPassword,
    verifyPassword,
    generateRandomPassword
};
