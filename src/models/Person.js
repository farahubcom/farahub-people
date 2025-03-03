const pick = require("lodash/pick");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;


class Person {

    /**
     * Generate new code for new creating person
     * 
     * @param {{ connection : object, inject: function }}
     * @return Number
     */
    static async generateCode({ connection, inject }) {
        try {
            const Person = this.model('Person');
            let code = 0;
            let exist = true;
            while (exist) {
                code += 1;
                exist = await Person.findOne({ code });
            }
            return code;
        } catch (error) {
            throw error
        }
    }

    /**
     * Create new or update an exsiting person
     * 
     * @param {Object} data data
     * @param {string} personId updating person
     * @param {Object} request request object
     * @returns modified product
     */
    static async createOrUpdate(data, personId, { connection, inject }) {
        try {
            const Person = this.model('Person');

            // create or get instance
            const person = personId ?
                await Person.findById(personId) : new Person();

            // assign code
            person.code = data.code || await this.generateCode({ connection, inject });

            // assign roles
            // const Meta = this.model('Meta');
            // person.roles = await Promise.all(
            //     data.roles.map(
            //         async _rule => {
            //             let role = await Doc.resolve(_rule, Meta);

            //             if (!role && _rule.identifier) {
            //                 role = await Meta.findOne({ identifier: _rule.identifier });

            //                 if (!role) {
            //                     role = await Meta.createOrUpdate({ ..._rule, label: 'role' }, null, { inject, connection });
            //                 }
            //             }

            //             return role && role.id;
            //         }
            //     ).filter(Boolean)
            // )

            // assign other fields
            Object.keys(
                pick(data, [
                    'firstName',
                    'lastName',
                    'phone',
                    // 'telephone',
                    'email',
                    // 'address',
                    // 'note'
                ])
            ).forEach(key => {
                person[key] = data[key];
            });

            // inject pre save hooks
            await inject('preSave', { data, connection, inject, person });

            // save the changed
            await person.save();

            // inject post save hooks
            await inject('postSave', { data, connection, inject, person });

            // return modified person
            return person;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get person full name
     * 
     * @returns {string}
     */
    get fullName() {
        return Boolean(this.firstName) || Boolean(this.lastName) ? [this.firstName, this.lastName].join(' ') : null;
    }

    // get fullAddress() {
    //     if (!this.address)
    //         return '';

    //     return [
    //         this.address.province,
    //         this.address.city,
    //         this.address.area,
    //         this.address.street,
    //         this.address.address
    //     ].filter(Boolean).join(', ');
    // }
}

module.exports = Person;