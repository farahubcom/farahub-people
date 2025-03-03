const { Listener } = require("@farahub/framework/foundation");


class LogPersonModificationActivity extends Listener {

    /**
     * handle the event
     * 
     * @param {Login} event event
     */
    async handle(event) {

        const Activity = event.connection.model('Activity');

        const eventIdentifier = 'people:person:'.concat(event.person.wasNew ? 'create' : 'update');
        const ActivityEvent = event.connection.model('ActivityEvent');
        const activityEvent = await ActivityEvent.findByIdentifierOrCreate(eventIdentifier, {
            'fa-IR': `{user} شخص {person} را ${event.person.wasNew ? 'ایجاد' : 'بروزرسانی'} کرد.`,
            'en-US': `{user} ${event.person.wasNew ? 'created' : 'updated'} {person}`
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


module.exports = LogPersonModificationActivity;