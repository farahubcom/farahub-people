class PersonCreatedOrUpdated {

    /**
     * Modified person
     * 
     * @var Person
     */
    person;

    /**
     * Workspace connection
     * 
     * @var Connection
     */
    connection;

    /**
     * Authentiacated user
     * 
     * @var User
     */
    user;

    /**
     * Create event instance
     * 
     * @constructor
     * @param {Person} person Modified person
     * @param {Connection} connection Workspace connection
     * @param {User} user Authenticated user
     */
    constructor(person, connection, user) {
        this.person = person;
        this.connection = connection;
        this.user = user;
    }
}

module.exports = PersonCreatedOrUpdated;