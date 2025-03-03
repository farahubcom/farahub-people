const { Condition } = require("@farahub/framework/foundation");


class PersonCreated extends Condition {

    /**
     * Name of the condition
     * 
     * @var string
     */
    name = 'Person created';

    /**
     * Identifier of the condition
     * 
     * @var string
     */
    identifier = 'person-created';

    /**
     * Handle the condition
     * 
     * @param {Object} params condition params provided by where dispatched
     * @param {Object} data condition data stored in db by user
     * @return bool
     */
    handle(params, data) {
        return true;
    }
}

module.exports = PersonCreated;