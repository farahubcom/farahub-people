const { Listener } = require("@farahub/framework/foundation");


class LogPersonDeletionActivity extends Listener {

    /**
     * handle the event
     * 
     * @param {Login} event event
     */
    async handle(event) {

        const Activity = event.connection.model('Activity');

        const eventIdentifier = 'people:person:delete';
        const ActivityEvent = event.connection.model('ActivityEvent');
        const activityEvent = await ActivityEvent.findByIdentifierOrCreate(eventIdentifier, {
            'fa-IR': `{user} شخص {person} را حذف کرد.`,
            'en-US': `{user} deleted {person}`
        });

        await Activity.createNew({
            event: activityEvent,
            user: event.user,
            references: [{
                reference: event.person.id,
                referenceModel: 'Person'
            }]
        });

        //
    }
}


module.exports = LogPersonDeletionActivity;