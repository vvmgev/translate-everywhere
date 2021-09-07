const { clipboard } = require('electron');

module.exports.readText = (type = 'selection') => {
    return clipboard.readText(type);
};

module.exports.writeText = (text = '', type = 'selection') => {
    return clipboard.writeText(text, type);
};