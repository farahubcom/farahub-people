const Person = require('./Person');
const User = require('./User');


const schemas = {
    Person,
    'injects': {
        'Authentication': {
            User,
        }
    }
}

module.exports = schemas;