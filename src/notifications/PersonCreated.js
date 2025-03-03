class PersonCreated {

    /**
     * Created person
     * 
     * @var Client
     */
    person;

    /**
     * Create notification instance
     * 
     */
    constructor(person) {
        this.person = person;
    }

    /**
     * return list of channels that you want to send notification to
     * @returns {string[]}
     */
    via() {
        return ['database'];
    }

    /**
     *
     * @param {{ email : string }} notifiable
     * @returns {{subject: string, from: string, html: string, to}}
     */
    toDatabase(notifiable) {
        return {
            title: {
                'fa-IR': 'شخص جدید ایجاد گردید.'
            },
            content: {
                'fa-IR': `شخص "${this.person.fullName}" را ایجاد گردید.`
            }
        }
    }
}

module.exports = PersonCreated;