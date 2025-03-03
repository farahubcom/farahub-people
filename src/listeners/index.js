const PersonCreatedOrUpdated = require("../events/PersonCreatedOrUpdated");
const PersonDeleted = require("../events/PersonDeleted");
const LogPersonDeletionActivity = require("./LogPersonDeletionActivity");
const LogPersonModificationActivity = require("./LogPersonModificationActivity");


module.exports = new Map([
    [
        PersonCreatedOrUpdated, [
            LogPersonModificationActivity,
        ],

        PersonDeleted, [
            LogPersonDeletionActivity,
        ]
    ]
]);