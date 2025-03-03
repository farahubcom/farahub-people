const { Module } = require("@farahub/framework/foundation");
const models = require('./models');
const schemas = require('./schemas');
const controllers = require('./controllers');
const hooks = require('./hooks');
const listeners = require('./listeners');
const conditions = require('./conditions');
const triggers = require('./triggers');


class PeopleModule extends Module {

    /**
     * The module name
     * 
     * @var string
     */
    name = 'People';

    /**
     * The module version
     * 
     * @var string
     */
    version = '1.0.0';

    /**
     * The module base path
     * 
     * use for routing 
     * 
     * @var string
     */
    basePath = '';

    /**
     * The module hooks
     * 
     * @var object
     */
    hooks = hooks;

    /**
     * The module conditions
     * 
     * @var object
     */
    conditions = conditions;

    /**
     * The module triggers
     * 
     * @var object
     */
    triggers = triggers;

    /**
     * Register the module
     * 
     * @return void
     */
    register() {
        this.registerModels(models);
        this.registerSchemas(schemas);
        this.registerListeners(listeners);
        this.registerControllers(controllers);
    }
}

module.exports = PeopleModule;