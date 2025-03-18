const { Controller } = require("@farahub/framework/foundation");
const { Doc, Num, Lang, Validator, Injection, Event, Auth, Workspace } = require("@farahub/framework/facades");
const CreateOrUpdatePersonValidator = require('../validators/CreateOrUpdatePersonValidator');
const PersonDetailsValidator = require('../validators/PersonDetailsValidator');
const PersonDeleteValidator = require('../validators/PersonDeleteValidator');
const flatten = require('lodash/flatten');


class MainController extends Controller {

    /**
     * The controller name
     * 
     * @var string
     */
    name = 'Main';

    /**
     * The controller base path
     * 
     * @var string
     */
    basePath = '/people';

    /**
     * The controller routes
     * 
     * @var array
     */
    routes = [
        {
            type: 'api',
            method: 'get',
            path: '/',
            handler: 'list',
        },
        {
            type: 'api',
            method: 'get',
            path: '/new/code',
            handler: 'newCode',
        },
        {
            type: 'api',
            method: 'post',
            path: '/',
            handler: 'createOrUpdate',
        },
        {
            type: 'api',
            method: 'get',
            path: '/:personId',
            handler: 'details',
        },
        {
            type: 'api',
            method: 'delete',
            path: '/:personId',
            handler: 'delete',
        }
    ]

    /**
     * List of people match params
     * 
     * @return void
     */
    list() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app),
            Injection.register(this.module, 'main.list'),
            async (req, res, next) => {
                try {

                    const { wsConnection: connection } = req;

                    const Person = connection.model('Person');

                    const searchInjections = await req.inject('search', { user });

                    const args = req.query;

                    let search = {
                        ...(searchInjections && Object.assign({},
                            ...searchInjections
                        ))
                    }

                    if (args && args.query && args.query !== '') {
                        search = {
                            ...search,
                            ...(
                                Num.isNumeric(args.query) ?
                                    { code: Number(args.query) } :
                                    {
                                        $or: [
                                            { firstName: { $regex: args.query + '.*' } },
                                            { lastName: { $regex: args.query + '.*' } }
                                        ]
                                    }
                            )
                        }
                    }

                    const sort = args && args.sort ? args.sort : "-createdAt";

                    const populationInjections = await req.inject('populate');

                    const query = Person.find(search)
                        .select('-__v')
                        .populate([
                            ...(populationInjections || [])
                        ]);

                    query.sort(sort);

                    const total = await Person.find(search).count();

                    if (args && args.page > -1) {
                        const perPage = args.perPage || 25;
                        query.skip(args.page * perPage)
                            .limit(perPage)
                    }

                    let data = await query.lean({ virtuals: true });

                    data = Lang.translate(data);

                    return res.json({ ok: true, data, total })
                } catch (error) {
                    next(error);
                }
            }
        ]
    }


    /**
     * Get new code for new creating person
     * 
     * @return void
     */
    newCode() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app),
            Injection.register(this.module, 'main.newCode'),
            async function (req, res, next) {
                try {
                    const { wsConnection: connection, inject } = req;
                    const Person = connection.model('Person');
                    const code = await Person.generateCode({ connection, inject });
                    return res.json({ ok: true, code })
                } catch (error) {
                    next(error);
                }
            }
        ]
    }

    /**
     * Create or upadte an existing person
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    createOrUpdate() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app),
            Injection.register(this.module, 'main.createOrUpdate'),
            Validator.validate(new CreateOrUpdatePersonValidator()),
            Event.register(this.module),
            async function (req, res, next) {
                try {

                    const data = req.body;

                    const { inject, wsConnection: connection, workspace, user } = req;

                    const Person = connection.model('Person');

                    const person = await Person.createOrUpdate(data, data.id, { inject, connection });

                    // create related user
                    if (person.wasNew && data.phone) {

                        const User = this.app.connection.model('User');

                        let user = await User.findOne({ phone: data.phone });
                        if (!user) {
                            user = await User.createNew(data, {
                                inject: Injection.register(this.app.module('Authentication'), 'main.createNew', false)
                            });
                        }

                        const hasMember = await req.workspace.hasMember(user);
                        if (!hasMember) {
                            await req.workspace.addMember(user);

                            await req.workspace.setAsUserCurrentWorkspace(user);
                        }
                    }

                    res.json({ ok: true, person });


                    // inject post response hooks
                    await inject('postResponse', { data, workspace, connection, inject, person, user, });

                    return;
                } catch (error) {
                    next(error);
                }
            }
        ]
    }

    /**
     * Get person details
     * 
     * @param {*} req request
     * @param {*} res response
     */
    details() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app),
            Injection.register(this.module, 'main.details'),
            Validator.validate(new PersonDetailsValidator()),
            async function (req, res, next) {
                try {

                    const { personId } = req.params;
                    const { wsConnection: connection, inject } = req;

                    const populationInjections = await inject('populate');

                    const Person = connection.model('Person');

                    const query = Person.findById(personId)
                        .select('-__v')
                        .populate([
                            ...(populationInjections || [])
                        ]);

                    const response = await query.lean({ virtuals: true });

                    const person = Lang.translate(response);

                    return res.json({ ok: true, person })
                } catch (error) {
                    next(error);
                }
            }
        ]
    }

    /**
     * Delete an existing person from db
     * 
     * @param {*} req request
     * @param {*} res response
     * 
     * @return void
     */
    delete() {
        return [
            Auth.authenticate('jwt', { session: false }),
            Workspace.resolve(this.app),
            Injection.register(this.module, 'main.delete'),
            Validator.validate(new PersonDeleteValidator()),
            Event.register(this.module),
            async function (req, res, next) {
                try {
                    const { personId } = req.params;
                    const { wsConnection: connection, inject } = req;

                    const Person = connection.model('Person');

                    // get person document
                    const person = await Doc.resolve(personId, Person);

                    // check if person can be deleted
                    const injectedRelations = await inject('relations', { person, connection }) || [];

                    if (flatten(injectedRelations).length > 0) {
                        return res.json({
                            ok: false,
                            status: 0,
                            message: 'Can not be deleted',
                            relations: flatten(injectedRelations)
                        });
                    }

                    // inject delete pre hook
                    await inject('preDelete', { person });

                    // delete the person
                    await Person.deleteOne({ _id: person.id });

                    // inject delete post hook
                    await inject('postDelete');

                    // dispatch event
                    // req.event(new PersonDeleted(person, req.wsConnection, req.user));

                    // return response
                    return res.json({ ok: true })
                } catch (error) {
                    next(error);
                }
            }
        ]
    }
}

module.exports = MainController;