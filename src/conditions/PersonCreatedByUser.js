const { Condition } = require("@farahub/framework/foundation");


class PersonCreatedByUser extends Condition {

    /**
     * Name of the condition
     * 
     * @var string
     */
    name = 'Person created by user';

    /**
     * Identifier of the condition
     * 
     * @var string
     */
    identifier = 'person-created-by-user';

    /**
     * Handle the condition
     * 
     * @param {Object} params condition params provided by where dispatched
     * @param {Object} data condition data stored in db by user
     * @return bool
     */
    handle(params, data) {
        if (!params.user || !data.userId) return false;
        return params.user.id === data.userId;
    }
}

module.exports = PersonCreatedByUser;